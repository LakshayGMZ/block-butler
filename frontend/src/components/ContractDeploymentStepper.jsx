"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Loader2, AlertCircle, Code, Zap, Shield, ExternalLink, Copy, ArrowRight } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Code Compilation",
    description: "Compiling Solidity code and checking for errors",
    icon: Code,
  },
  {
    id: 2,
    title: "Gas Estimation",
    description: "Calculating deployment costs and gas requirements",
    icon: Zap,
  },
  {
    id: 3,
    title: "Security Check",
    description: "Running security analysis on smart contract",
    icon: Shield,
  },
  {
    id: 4,
    title: "Deployment",
    description: "Deploying contract to Ethereum network",
    icon: ExternalLink,
  },
]

export default function ContractDeploymentStepper({ contractCode, onComplete, onCancel, isActive = false }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepStatus, setStepStatus] = useState({}) // success, error, loading
  const [deploymentData, setDeploymentData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isActive && currentStep < steps.length) {
      const timer = setTimeout(() => {
        processStep(currentStep)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, isActive])

  const processStep = async (stepIndex) => {
    setStepStatus((prev) => ({ ...prev, [stepIndex]: "loading" }))

    try {
      // Simulate step processing
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

      // Simulate occasional errors for demo
      if (Math.random() < 0.1 && stepIndex !== 3) {
        throw new Error(`Error in ${steps[stepIndex].title.toLowerCase()}`)
      }

      setStepStatus((prev) => ({ ...prev, [stepIndex]: "success" }))

      if (stepIndex === steps.length - 1) {
        // Final step - deployment complete
        const mockDeploymentData = {
          contractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c",
          transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
          gasUsed: "2,100,000",
          deploymentCost: "0.045 ETH",
          network: "Ethereum Mainnet",
        }
        setDeploymentData(mockDeploymentData)
        setTimeout(() => onComplete(mockDeploymentData), 1500)
      } else {
        setCurrentStep(stepIndex + 1)
      }
    } catch (err) {
      setStepStatus((prev) => ({ ...prev, [stepIndex]: "error" }))
      setError(err.message)
    }
  }

  const retryStep = () => {
    setError(null)
    setStepStatus((prev) => ({ ...prev, [currentStep]: undefined }))
    processStep(currentStep)
  }

  const getStepIcon = (stepIndex) => {
    const IconComponent = steps[stepIndex].icon
    const status = stepStatus[stepIndex]

    if (status === "loading") {
      return <Loader2 className="size-5 animate-spin text-blue-500" />
    } else if (status === "success") {
      return <CheckCircle className="size-5 text-green-500" />
    } else if (status === "error") {
      return <AlertCircle className="size-5 text-red-500" />
    } else if (stepIndex <= currentStep) {
      return <IconComponent className="size-5 text-blue-500" />
    } else {
      return <IconComponent className="size-5 text-gray-400" />
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl p-6 shadow-sm max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-black text-lg">Contract Deployment</h3>
          <p className="text-sm text-gray-600">
            {deploymentData ? "Deployment completed successfully!" : "Deploying your smart contract to Ethereum"}
          </p>
        </div>
        {!deploymentData && (
          <button onClick={onCancel} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Cancel
          </button>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
              index <= currentStep ? "bg-[#f7f3f2]" : "bg-transparent"
            }`}
          >
            <div className="flex-shrink-0">{getStepIcon(index)}</div>

            <div className="flex-1">
              <h4
                className={`font-medium ${
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
              <p className="text-sm text-gray-600">{step.description}</p>

              {stepStatus[index] === "error" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-red-600">{error}</span>
                  <button onClick={retryStep} className="text-sm text-blue-600 hover:text-blue-800 underline">
                    Retry
                  </button>
                </div>
              )}
            </div>

            {index < steps.length - 1 && stepStatus[index] === "success" && (
              <ArrowRight className="size-4 text-gray-400" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Deployment Results */}
      <AnimatePresence>
        {deploymentData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="size-5 text-green-600" />
              <h4 className="font-medium text-green-800">Deployment Successful!</h4>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contract Address:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded text-xs font-mono">{deploymentData.contractAddress}</code>
                  <button
                    onClick={() => copyToClipboard(deploymentData.contractAddress)}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <Copy className="size-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Transaction Hash:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-2 py-1 rounded text-xs font-mono">
                    {deploymentData.transactionHash.slice(0, 10)}...
                  </code>
                  <button
                    onClick={() => copyToClipboard(deploymentData.transactionHash)}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <Copy className="size-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Gas Used:</span>
                <span className="font-medium">{deploymentData.gasUsed}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Cost:</span>
                <span className="font-medium">{deploymentData.deploymentCost}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-medium">{deploymentData.network}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-green-200">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                View on Etherscan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
