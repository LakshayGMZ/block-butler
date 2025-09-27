"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Copy, Settings } from "lucide-react"

export default function CodeEditor({ initialCode, onDeploy, onCancel }) {
  const [code, setCode] = useState(
    initialCode ||
      `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    event DataStored(uint256 data);
    
    function set(uint256 x) public {
        storedData = x;
        emit DataStored(x);
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`,
  )

  const [isDeploying, setIsDeploying] = useState(false)
  const [deployStatus, setDeployStatus] = useState("") // success, error

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      // Simulate deployment
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setDeployStatus("success")
      setTimeout(() => {
        onDeploy({ code, contractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c" })
      }, 1500)
    } catch (error) {
      setDeployStatus("error")
      setTimeout(() => {
        setDeployStatus("")
        setIsDeploying(false)
      }, 2000)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f7f3f2] border-b border-[#dedbda]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="size-3 bg-red-400 rounded-full" />
            <div className="size-3 bg-yellow-400 rounded-full" />
            <div className="size-3 bg-green-400 rounded-full" />
          </div>
          <h3 className="font-medium text-black">Smart Contract Editor</h3>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={copyCode} className="p-2 hover:bg-[#dedbda] rounded-lg transition-colors" title="Copy code">
            <Copy className="size-4" />
          </button>
          <button className="p-2 hover:bg-[#dedbda] rounded-lg transition-colors" title="Settings">
            <Settings className="size-4" />
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-96 p-4 bg-[#faf8f7] text-sm font-mono resize-none outline-none"
          style={{ tabSize: 2 }}
          spellCheck={false}
        />

        {/* Line numbers */}
        <div className="absolute left-0 top-0 p-4 text-xs text-gray-400 font-mono pointer-events-none select-none">
          {code.split("\n").map((_, i) => (
            <div key={i} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f7f3f2] border-t border-[#dedbda]">
        <div className="text-sm text-gray-600">
          {deployStatus === "success" && "✅ Contract deployed successfully!"}
          {deployStatus === "error" && "❌ Deployment failed. Please try again."}
          {!deployStatus && "Ready to deploy"}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeploying}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#faf8f7] border border-[#dedbda] rounded-lg hover:bg-[#dedbda] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            disabled={isDeploying || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Play className="size-4" />
                </motion.div>
                Deploying...
              </>
            ) : (
              <>
                <Play className="size-4" />
                Deploy Contract
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
