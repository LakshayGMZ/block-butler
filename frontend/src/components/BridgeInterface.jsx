"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, AlertCircle, Clock } from "lucide-react"

export default function BridgeInterface({ onBridge, onCancel }) {
  const [fromChain, setFromChain] = useState("Ethereum")
  const [toChain, setToChain] = useState("Polygon")
  const [token, setToken] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("5-10 minutes")

  const chains = [
    { name: "Ethereum", color: "from-blue-400 to-blue-600" },
    { name: "Polygon", color: "from-purple-400 to-purple-600" },
    { name: "Arbitrum", color: "from-blue-400 to-cyan-500" },
    { name: "Optimism", color: "from-red-400 to-pink-500" },
  ]

  const handleBridge = () => {
    const bridgeData = {
      fromChain,
      toChain,
      token,
      amount,
      estimatedTime,
      bridgeFee: "0.001 ETH",
    }
    onBridge(bridgeData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl p-4 shadow-sm max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium text-black">Bridge Tokens</h3>
        <AlertCircle className="size-4 text-amber-500" />
      </div>

      {/* Chain Selection */}
      <div className="space-y-4">
        {/* From Chain */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">From Chain</label>
          <select
            value={fromChain}
            onChange={(e) => setFromChain(e.target.value)}
            className="w-full p-3 bg-[#f7f3f2] border border-[#dedbda] rounded-lg outline-none"
          >
            {chains.map((chain) => (
              <option key={chain.name} value={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bridge Direction */}
        <div className="flex justify-center">
          <div className="p-2 bg-[#dedbda] rounded-lg">
            <ArrowRight className="size-4" />
          </div>
        </div>

        {/* To Chain */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">To Chain</label>
          <select
            value={toChain}
            onChange={(e) => setToChain(e.target.value)}
            className="w-full p-3 bg-[#f7f3f2] border border-[#dedbda] rounded-lg outline-none"
          >
            {chains
              .filter((chain) => chain.name !== fromChain)
              .map((chain) => (
                <option key={chain.name} value={chain.name}>
                  {chain.name}
                </option>
              ))}
          </select>
        </div>

        {/* Token and Amount */}
        <div className="bg-[#f7f3f2] rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-sm text-gray-600">Balance: 1,234.56 {token}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-xl font-medium outline-none"
            />
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-[#dedbda] rounded-lg px-3 py-2 font-medium outline-none"
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="ETH">ETH</option>
              <option value="MATIC">MATIC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bridge Info */}
      <div className="mt-4 p-3 bg-[#f7f3f2] rounded-lg space-y-2">
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <Clock className="size-4" />
          <span>Estimated time: {estimatedTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Bridge Fee</span>
          <span>0.001 ETH</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">You will receive</span>
          <span className="font-medium">
            ~{amount || "0"} {token}
          </span>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex gap-2">
          <AlertCircle className="size-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Cross-chain bridges can take several minutes to complete. Do not close this window during the process.
          </p>
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
          onClick={handleBridge}
          disabled={!amount || Number.parseFloat(amount) <= 0}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors disabled:opacity-50"
        >
          Bridge Tokens
        </button>
      </div>
    </motion.div>
  )
}
