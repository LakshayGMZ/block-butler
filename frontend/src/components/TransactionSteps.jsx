"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Loader2, AlertTriangle, Wallet, Network, Zap, Shield, ExternalLink, Copy } from "lucide-react"

const transactionSteps = [
  {
    id: 1,
    title: "Wallet Confirmation",
    description: "Confirm transaction in your wallet",
    icon: Wallet,
  },
  {
    id: 2,
    title: "Network Validation",
    description: "Validating transaction on network",
    icon: Network,
  },
  {
    id: 3,
    title: "Gas Processing",
    description: "Processing gas fees and execution",
    icon: Zap,
  },
  {
    id: 4,
    title: "Security Check",
    description: "Final security validation",
    icon: Shield,
  },
]

export default function TransactionSteps({ transaction, onComplete, onCancel, isActive = false }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStatus, setStepStatus] = useState({})
  const [transactionHash, setTransactionHash] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isActive && currentStep < transactionSteps.length) {
      const timer = setTimeout(() => {
        processStep(currentStep)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentStep, isActive])

  const processStep = async (stepIndex) => {
    setStepStatus((prev) => ({ ...prev, [stepIndex]: "loading" }))

    try {
      // Simulate step processing
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

      setStepStatus((prev) => ({ ...prev, [stepIndex]: "success" }))

      if (stepIndex === transactionSteps.length - 1) {
        // Final step - transaction complete
        const mockTxHash = "0xabcdef1234567890abcdef1234567890abcdef12"
        setTransactionHash(mockTxHash)
        setTimeout(() => onComplete({ ...transaction, transactionHash: mockTxHash }), 1000)
      } else {
        setCurrentStep(stepIndex + 1)
      }
    } catch (err) {
      setStepStatus((prev) => ({ ...prev, [stepIndex]: "error" }))
      setError(err.message)
    }
  }

  const getStepIcon = (stepIndex) => {
    const IconComponent = transactionSteps[stepIndex].icon
    const status = stepStatus[stepIndex]

    if (status === "loading") {
      return <Loader2 className="size-4 animate-spin text-blue-500" />
    } else if (status === "success") {
      return <CheckCircle className="size-4 text-green-500" />
    } else if (status === "error") {
      return <AlertTriangle className="size-4 text-red-500" />
    } else if (stepIndex <= currentStep) {
      return <IconComponent className="size-4 text-blue-500" />
    } else {
      return <IconComponent className="size-4 text-gray-400" />
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl p-4 shadow-sm max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-black">Processing Transaction</h3>
          <p className="text-sm text-gray-600">
            {transactionHash ? "Transaction completed!" : "Please wait while we process your transaction"}
          </p>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-[#f7f3f2] rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">
            {transaction.amount} {transaction.token}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="text-gray-600">Gas Fee:</span>
          <span className="font-medium">{transaction.gasFee} ETH</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-4">
        {transactionSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              index <= currentStep ? "bg-[#f7f3f2]" : "bg-transparent"
            }`}
          >
            <div className="flex-shrink-0">{getStepIcon(index)}</div>

            <div className="flex-1">
              <h4
                className={`text-sm font-medium ${
                  stepStatus[index] === "success"
                    ? "text-green-700"
                    : stepStatus[index] === "error"
                      ? "text-red-700"
                      : index <= currentStep
                        ? "text-black"
                        : "text-gray-500"
                }`}
              >
                {step.title}
              </h4>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction Hash */}
      <AnimatePresence>
        {transactionHash && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Transaction Successful!</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Transaction Hash:</span>
              <div className="flex items-center gap-1">
                <code className="bg-white px-2 py-1 rounded text-xs font-mono">
                  {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
                </code>
                <button
                  onClick={() => copyToClipboard(transactionHash)}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Copy className="size-3" />
                </button>
                <button className="p-1 hover:bg-white rounded transition-colors">
                  <ExternalLink className="size-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Button */}
      {!transactionHash && (
        <div className="mt-4">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-[#f7f3f2] border border-[#dedbda] rounded-lg hover:bg-[#dedbda] transition-colors"
          >
            Cancel Transaction
          </button>
        </div>
      )}
    </motion.div>
  )
}
