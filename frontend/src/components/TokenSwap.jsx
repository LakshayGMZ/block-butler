"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpDown, Settings } from "lucide-react"

export default function TokenSwap({ onSwap, onCancel }) {
  const [fromToken, setFromToken] = useState({ symbol: "ETH", balance: "1.234" })
  const [toToken, setToToken] = useState({ symbol: "USDC", balance: "2,456.78" })
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleFromAmountChange = (value) => {
    setFromAmount(value)
    // Simulate exchange rate calculation
    const rate = fromToken.symbol === "ETH" ? 2500 : 0.0004
    setToAmount((Number.parseFloat(value) * rate).toFixed(6))
  }

  const handleConfirmSwap = () => {
    const swapData = {
      from: { token: fromToken.symbol, amount: fromAmount },
      to: { token: toToken.symbol, amount: toAmount },
      slippage,
      estimatedGas: "0.003 ETH",
    }
    onSwap(swapData)
  }

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
            <span className="text-sm text-gray-600">Balance: {fromToken.balance}</span>
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
            <span className="text-sm text-gray-600">Balance: {toToken.balance}</span>
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
            1 {fromToken.symbol} = {fromToken.symbol === "ETH" ? "2,500" : "0.0004"} {toToken.symbol}
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
      </div>

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
          disabled={!fromAmount || Number.parseFloat(fromAmount) <= 0}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-50"
        >
          Swap Tokens
        </button>
      </div>
    </motion.div>
  )
}
