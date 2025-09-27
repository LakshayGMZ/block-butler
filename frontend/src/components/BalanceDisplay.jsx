"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, RefreshCw } from "lucide-react"

export default function BalanceDisplay({ balances, onRefresh }) {
  const totalValue = balances?.reduce((sum, token) => sum + (token.value || 0), 0) || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="size-5 text-gray-600" />
          <h3 className="font-medium text-black">Wallet Balance</h3>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-[#dedbda] rounded-lg transition-colors"
          title="Refresh balances"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>

      {/* Total Value */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-black">${totalValue.toFixed(2)}</p>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className="size-3 text-green-500" />
          <span className="text-green-500">+2.4% (24h)</span>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-3">
        {balances?.map((token, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-[#f7f3f2] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {token.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-black">{token.symbol}</p>
                <p className="text-sm text-gray-600">{token.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-black">{token.balance}</p>
              <p className="text-sm text-gray-600">${token.value?.toFixed(2) || "0.00"}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
