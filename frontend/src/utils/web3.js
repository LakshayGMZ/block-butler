// Web3 utility functions for blockchain interactions
export class Web3Utils {
  constructor() {
    this.provider = null
    this.signer = null
    this.isConnected = false
  }

  // Connect to MetaMask or other Web3 wallet
  async connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        this.provider = window.ethereum
        this.isConnected = true

        return {
          success: true,
          address: accounts[0],
          chainId: await this.getChainId(),
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        return { success: false, error: error.message }
      }
    } else {
      return { success: false, error: "MetaMask not installed" }
    }
  }

  // Get current chain ID
  async getChainId() {
    if (!this.provider) return null
    try {
      return await this.provider.request({ method: "eth_chainId" })
    } catch (error) {
      console.error("Failed to get chain ID:", error)
      return null
    }
  }

  // Get account balance
  async getBalance(address) {
    if (!this.provider) return null
    try {
      const balance = await this.provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      // Convert from wei to ETH
      return (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
    } catch (error) {
      console.error("Failed to get balance:", error)
      return null
    }
  }

  // Send transaction
  async sendTransaction(to, value, data = "0x") {
    if (!this.provider) throw new Error("Wallet not connected")

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" })
      const from = accounts[0]

      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to,
            value: "0x" + (Number.parseFloat(value) * Math.pow(10, 18)).toString(16),
            data,
          },
        ],
      })

      return { success: true, txHash }
    } catch (error) {
      console.error("Transaction failed:", error)
      return { success: false, error: error.message }
    }
  }

  // Estimate gas for transaction
  async estimateGas(to, value, data = "0x") {
    if (!this.provider) return null

    try {
      const accounts = await this.provider.request({ method: "eth_accounts" })
      const from = accounts[0]

      const gasEstimate = await this.provider.request({
        method: "eth_estimateGas",
        params: [
          {
            from,
            to,
            value: "0x" + (Number.parseFloat(value) * Math.pow(10, 18)).toString(16),
            data,
          },
        ],
      })

      return Number.parseInt(gasEstimate, 16)
    } catch (error) {
      console.error("Failed to estimate gas:", error)
      return null
    }
  }

  // Get current gas price
  async getGasPrice() {
    if (!this.provider) return null

    try {
      const gasPrice = await this.provider.request({
        method: "eth_gasPrice",
      })
      return Number.parseInt(gasPrice, 16)
    } catch (error) {
      console.error("Failed to get gas price:", error)
      return null
    }
  }

  // Switch network
  async switchNetwork(chainId) {
    if (!this.provider) return false

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
      return true
    } catch (error) {
      console.error("Failed to switch network:", error)
      return false
    }
  }

  // Add token to wallet
  async addToken(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {
    if (!this.provider) return false

    try {
      await this.provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      })
      return true
    } catch (error) {
      console.error("Failed to add token:", error)
      return false
    }
  }
}

// Create singleton instance
export const web3Utils = new Web3Utils()

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: "0x1",
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/",
    blockExplorer: "https://etherscan.io",
  },
  polygon: {
    chainId: "0x89",
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com",
  },
  arbitrum: {
    chainId: "0xa4b1",
    name: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io",
  },
}

// Common token addresses
export const TOKENS = {
  ethereum: {
    USDC: "0xA0b86a33E6441b8435b662303c0f098C8c5c0f8b",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  polygon: {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
}
