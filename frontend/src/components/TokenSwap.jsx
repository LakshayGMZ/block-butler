import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Settings, AlertCircle } from "lucide-react";
import { ethers } from "ethers";
import { Token, CurrencyAmount, TradeType } from "@uniswap/sdk-core";

// Uniswap contract addresses
const UNIVERSAL_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"; // Mainnet Universal Router
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3"; // Permit2 contract

export default function TokenSwap({ onSwap, onCancel }) {
  // Token definitions with chain data
  const [fromToken, setFromToken] = useState({
    symbol: "ETH",
    balance: "1.234",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    chainId: 1, // Ethereum Mainnet
  });
  const [toToken, setToToken] = useState({
    symbol: "USDC",
    balance: "2,456.78",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    chainId: 1, // Ethereum Mainnet
  });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [swapStatus, setSwapStatus] = useState({ loading: false, error: null });
  const [wallet, setWallet] = useState(null);
  const [uniswapQuote, setUniswapQuote] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [router, setRouter] = useState(null);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    // Simulate exchange rate calculation
    const rate = fromToken.symbol === "ETH" ? 2500 : 0.0004;
    setToAmount((Number.parseFloat(value) * rate).toFixed(6));
  };

  // Connect wallet function using Ethereum provider
  const connectWallet = async () => {
    try {
      setSwapStatus({ loading: true, error: null });

      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const ethersSigner = await ethersProvider.getSigner();
        const userAddress = await ethersSigner.getAddress();
        const chainId = (await ethersProvider.getNetwork()).chainId;

        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setWallet({
          address: userAddress,
          chainId: Number(chainId),
        });

      

        setSwapStatus({ loading: false, error: null });
      } else {
        throw new Error(
          "Ethereum provider not found. Please install MetaMask.",
        );
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setSwapStatus({
        loading: false,
        error: error.message || "Failed to connect wallet",
      });
    }
  };

  // Get Uniswap quote using the SDK
  const getUniswapQuote = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0 || !router || !provider)
      return;

    try {
      setSwapStatus({ loading: true, error: null });

      // Create token instances for from/to tokens
      const tokenIn = new Token(
        fromToken.chainId,
        fromToken.address,
        fromToken.decimals,
        fromToken.symbol,
      );

      const tokenOut = new Token(
        toToken.chainId,
        toToken.address,
        toToken.decimals,
        toToken.symbol,
      );

      // Convert amount to wei
      const amountIn = ethers
        .parseUnits(fromAmount, fromToken.decimals)
        .toString();

      // Special case for ETH which is handled differently
      const isEthToToken =
        fromToken.address.toLowerCase() ===
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase();
      const isTokenToEth =
        toToken.address.toLowerCase() ===
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase();

      const currencyIn = isEthToToken
        ? { isNative: true, decimals: 18, symbol: "ETH" }
        : tokenIn;
      const currencyOut = isTokenToEth
        ? { isNative: true, decimals: 18, symbol: "ETH" }
        : tokenOut;

      const currencyAmount = CurrencyAmount.fromRawAmount(currencyIn, amountIn);

      // Get route from router
      const route = await router.route(
        currencyAmount,
        currencyOut,
        TradeType.EXACT_INPUT,
        {
          recipient: wallet.address,
          slippageTolerance: parseFloat(slippage) / 100,
          deadline: Math.floor(Date.now() / 1000 + 1800), // 30 min deadline
        },
      );

      if (!route || !route.quote) {
        throw new Error("No route found for this swap");
      }

      // Format output amount based on token decimals
      const outputAmount = ethers.formatUnits(
        route.quote.toString(),
        toToken.decimals,
      );

      const quote = {
        amountOut: outputAmount,
        route: route.route.map((r) => ({
          pool: r.poolAddress,
          tokenIn: r.tokenIn.address,
          tokenOut: r.tokenOut.address,
          fee: r.fee,
        })),
        estimatedGas: ethers.formatEther(route.estimatedGasUsed),
        priceImpact: (route.priceImpact * 100).toFixed(2),
        methodParameters: route.methodParameters,
      };

      setUniswapQuote(quote);
      setToAmount(outputAmount);
      setSwapStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Quote error:", error);
      setSwapStatus({
        loading: false,
        error: "Failed to get quote: " + (error.message || "Unknown error"),
      });
    }
  };

  // Update quote when amount changes or tokens change
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && router) {
      getUniswapQuote();
    } else {
      setToAmount("");
      setUniswapQuote(null);
    }
  }, [fromAmount, fromToken.address, toToken.address, wallet, router]);

  const handleConfirmSwap = async () => {
    if (!wallet) {
      await connectWallet();
      return;
    }

    if (!uniswapQuote || !uniswapQuote.methodParameters || !signer) {
      await getUniswapQuote();
      return;
    }

    try {
      setSwapStatus({ loading: true, error: null });

      // Prepare transaction parameters
      const { calldata, value } = uniswapQuote.methodParameters;

      // Create transaction object
      const txParams = {
        to: UNIVERSAL_ROUTER_ADDRESS,
        data: calldata,
        value: ethers.parseUnits(value || "0", "wei"),
      };

      // Send transaction
      const tx = await signer.sendTransaction(txParams);
      console.log("Transaction sent:", tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      const swapData = {
        from: {
          token: fromToken.symbol,
          amount: fromAmount,
          address: fromToken.address,
        },
        to: {
          token: toToken.symbol,
          amount: toAmount,
          address: toToken.address,
        },
        slippage,
        estimatedGas: uniswapQuote.estimatedGas,
        txHash: tx.hash,
      };

      setSwapStatus({ loading: false, error: null });
      onSwap(swapData);
    } catch (error) {
      console.error("Swap error:", error);
      setSwapStatus({
        loading: false,
        error: "Swap failed: " + (error.message || "Unknown error"),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl p-4 shadow-sm max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-black">Token Swap</h3>
        <button className="p-2 hover:bg-[#dedbda] rounded-lg transition-colors">
          <Settings className="size-4" />
        </button>
      </div>

      {/* From Token */}
      <div className="space-y-4">
        <div className="bg-[#f7f3f2] rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">From</span>
            <span className="text-sm text-gray-600">
              Balance: {fromToken.balance}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-xl font-medium outline-none"
            />
            <div className="flex items-center gap-2 bg-[#dedbda] rounded-lg px-3 py-2">
              <div className="size-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full" />
              <span className="font-medium">{fromToken.symbol}</span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapTokens}
            className="p-2 bg-[#dedbda] hover:bg-[#c6c2c2] rounded-lg transition-colors"
          >
            <ArrowUpDown className="size-4" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-[#f7f3f2] rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">To</span>
            <span className="text-sm text-gray-600">
              Balance: {toToken.balance}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-xl font-medium outline-none"
            />
            <div className="flex items-center gap-2 bg-[#dedbda] rounded-lg px-3 py-2">
              <div className="size-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full" />
              <span className="font-medium">{toToken.symbol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Details */}
      <div className="mt-4 p-3 bg-[#f7f3f2] rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Rate</span>
          <span>
            1 {fromToken.symbol} ={" "}
            {fromToken.symbol === "ETH" ? "2,500" : "0.0004"} {toToken.symbol}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Slippage Tolerance</span>
          <span>{slippage}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Gas</span>
          <span>0.003 ETH</span>
        </div>
        {uniswapQuote && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Routing</span>
            <span className="text-xs text-right">
              Via Uniswap
              {uniswapQuote.route?.[0] && (
                <span className="block text-gray-500">
                  {uniswapQuote.route[0].fee / 10000}% fee tier
                </span>
              )}
            </span>
          </div>
        )}
        {uniswapQuote && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price Impact</span>
            <span className="text-xs">{uniswapQuote.priceImpact}%</span>
          </div>
        )}
        {uniswapQuote && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Min Received</span>
            <span className="text-xs">
              {(
                parseFloat(uniswapQuote.amountOut) *
                (1 - parseFloat(slippage) / 100)
              ).toFixed(6)}{" "}
              {toToken.symbol}
            </span>
          </div>
        )}
      </div>

      {swapStatus.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{swapStatus.error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-[#f7f3f2] border border-[#dedbda] rounded-lg hover:bg-[#dedbda] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmSwap}
          disabled={
            !fromAmount ||
            Number.parseFloat(fromAmount) <= 0 ||
            swapStatus.loading
          }
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center"
        >
          {swapStatus.loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {wallet ? "Swapping..." : "Connecting..."}
            </>
          ) : wallet ? (
            "Swap Tokens"
          ) : (
            "Connect Wallet & Swap"
          )}
        </button>
      </div>
    </motion.div>
  );
}
