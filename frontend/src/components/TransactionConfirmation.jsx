
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useSendTransaction } from "wagmi"

export default function TransactionConfirmation({ transaction, onConfirm, onCancel }) {
  const [status, setStatus] = useState("pending") // pending, processing, success, error
  const { sendTransactionAsync } = useSendTransaction()

  const handleConfirm = async () => {
    setStatus("processing")

    try {
      // Construct tx request (values must be BigInt for wagmi/viem)
      const txRequest = {
        to: transaction.to,
        value: BigInt(Math.floor(Number(transaction.amount) * 1e18)), // convert ETH to wei
        gas: BigInt(transaction.gasLimit || 21000),
        gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
      }

      // Send transaction
      const txHash = await sendTransactionAsync(txRequest)

      console.log("Transaction sent:", txHash)
      setStatus("success")

      // Notify parent component with tx details
      onConfirm({
        ...transaction,
        hash: txHash,
      })
    } catch (error) {
      console.error("Transaction failed:", error)
      setStatus("error")

      // Reset after error
      setTimeout(() => {
        setStatus("pending")
      }, 2000)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="size-5 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="size-5 text-green-500" />
      case "error":
        return <XCircle className="size-5 text-red-500" />
      default:
        return <AlertTriangle className="size-5 text-amber-500" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Processing transaction..."
      case "success":
        return "Transaction successful!"
      case "error":
        return "Transaction failed. Please try again."
      default:
        return "Please review and confirm this transaction"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#faf8f7] border border-[#dedbda] rounded-xl p-4 shadow-sm max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {getStatusIcon()}
        <div>
          <h3 className="font-medium text-black">Transaction Confirmation</h3>
          <p className="text-sm text-gray-600">{getStatusMessage()}</p>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="space-y-3 mb-4">
        <div className="bg-[#f7f3f2] rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">From</span>
            <span className="text-sm font-mono">{transaction.from}</span>
          </div>

          <div className="flex justify-center my-2">
            <ArrowRight className="size-4 text-gray-400" />
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">To</span>
            <span className="text-sm font-mono">{transaction.to}</span>
          </div>

          <hr className="border-[#dedbda] my-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-lg font-medium">
              {transaction.amount} {transaction.token}
            </span>
          </div>
        </div>

        {/* Gas Fee */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Estimated Gas Fee</span>
          <span className="font-medium">{transaction.gasFee} ETH</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-base font-medium border-t border-[#dedbda] pt-2">
          <span>Total</span>
          <span>{transaction.total} ETH</span>
        </div>
      </div>

      {/* Action Buttons */}
      {status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-[#f7f3f2] border border-[#dedbda] rounded-lg hover:bg-[#dedbda] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            Confirm Transaction
          </button>
        </div>
      )}
    </motion.div>
  )
}

