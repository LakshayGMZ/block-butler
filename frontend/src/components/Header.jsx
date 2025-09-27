"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, ChevronDown, Copy, ExternalLink } from "lucide-react"
import { useWallet } from "../hooks/useWallet"
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  const { isConnected, address, balance, isLoading, error, connect, disconnect, refreshBalance } = useWallet()

  const [showDropdown, setShowDropdown] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    // You could add a toast notification here
  }

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const openInExplorer = () => {
    window.open(`https://etherscan.io/address/${address}`, "_blank")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#f7f3f2] border-b border-[#dedbda] px-4 py-3"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-lg"
            style={{
              background: "conic-gradient(from 45deg, #ff7a7a, #f8bf3f, #4fe3a3, #5aa9ff, #c07bff, #ff7a7a)",
            }}
          />
          <h1 className="text-xl font-medium text-black">BlockChat</h1>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">{error}</div>}

          {!isConnected ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={connect}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#dedbda] to-[#f9f7f6] rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#dedbda] disabled:opacity-50"
            >
              {/* <Wallet className="size-4" />
              <span className="text-sm font-medium">{isLoading ? "Connecting..." : "Connect Wallet"}</span> */}
              <ConnectButton/>
              
            </motion.button>
          ) : (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#dedbda] to-[#f9f7f6] rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[#dedbda]"
              >
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">{formatAddress(address)}</span>
                  <ChevronDown className="size-4" />
                </div>
              </motion.button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 bg-[#faf8f7] rounded-xl shadow-lg border border-[#dedbda] p-3 z-50"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Balance</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium">{balance} ETH</p>
                        <button onClick={refreshBalance} className="p-1 hover:bg-[#dedbda] rounded text-xs">
                          ↻
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Address</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{formatAddress(address)}</span>
                        <button onClick={copyAddress} className="p-1 hover:bg-[#dedbda] rounded" title="Copy address">
                          <Copy className="size-3" />
                        </button>
                        <button
                          onClick={openInExplorer}
                          className="p-1 hover:bg-[#dedbda] rounded"
                          title="View on Etherscan"
                        >
                          <ExternalLink className="size-3" />
                        </button>
                      </div>
                    </div>

                    <hr className="border-[#dedbda]" />

                    <button
                      onClick={() => {
                        disconnect()
                        setShowDropdown(false)
                      }}
                      className="w-full text-left text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                    >
                      Disconnect
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
