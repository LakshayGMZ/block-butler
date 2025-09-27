import { useState, useRef, useEffect } from "react"
import AIPrompt from "./AIPrompt"
import TransactionConfirmation from "./TransactionConfirmation"
import CodeEditor from "./CodeEditor"
import BalanceDisplay from "./BalanceDisplay"
import TokenSwap from "./TokenSwap"
import BridgeInterface from "./BridgeInterface"
import TransactionSteps from "./TransactionSteps"
import ContractDeploymentStepper from "./ContractDeploymentStepper"
import { motion, AnimatePresence } from "framer-motion"

const StreamingText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 20) // Adjust speed as needed

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return (
    <p className="text-sm sm:text-base whitespace-pre-wrap">
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block w-0.5 h-4 bg-current ml-1"
        />
      )}
    </p>
  )
}

const Message = ({
  message,
  isAi,
  onTransactionConfirm,
  onTransactionCancel,
  onCodeDeploy,
  onCodeCancel,
  onSwap,
  onBridge,
}) => {
  const [showStreamingComplete, setShowStreamingComplete] = useState(!isAi)
  const [showTransaction, setShowTransaction] = useState(false)
  const [showTransactionSteps, setShowTransactionSteps] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [showDeploymentStepper, setShowDeploymentStepper] = useState(false)
  const [showBalance, setShowBalance] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [showBridge, setShowBridge] = useState(false)

  const handleStreamingComplete = () => {
    setShowStreamingComplete(true)
    if (message.showTransaction) {
      setTimeout(() => setShowTransaction(true), 500)
    }
    if (message.showCodeEditor) {
      setTimeout(() => setShowCodeEditor(true), 500)
    }
    if (message.showBalance) {
      setTimeout(() => setShowBalance(true), 500)
    }
    if (message.showSwap) {
      setTimeout(() => setShowSwap(true), 500)
    }
    if (message.showBridge) {
      setTimeout(() => setShowBridge(true), 500)
    }
  }

  const handleTransactionConfirm = (txData) => {
    setShowTransaction(false)
    setShowTransactionSteps(true)
  }

  const handleDeploymentStart = (deployData) => {
    setShowCodeEditor(false)
    setShowDeploymentStepper(true)
  }

  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4`}>
      <div className="max-w-[80%] space-y-3">
        {/* Main message */}
        <div
          className={`
          relative px-4 py-3 rounded-xl ${
            isAi ? "rounded-tr-xl bg-white shadow-sm border border-[#dedbda]" : "bg-amber-300 rounded-tl-xl shadow-sm"
          }
        `}
        >
          <div className="relative z-10">
            {isAi ? (
              <StreamingText text={message.content} onComplete={handleStreamingComplete} />
            ) : (
              <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          <div className="text-[10px] mt-1 opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</div>
        </div>

        <AnimatePresence>
          {showTransaction && message.transactionData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TransactionConfirmation
                transaction={message.transactionData}
                onConfirm={handleTransactionConfirm}
                onCancel={() => {
                  setShowTransaction(false)
                  onTransactionCancel && onTransactionCancel()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTransactionSteps && message.transactionData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TransactionSteps
                transaction={message.transactionData}
                isActive={showTransactionSteps}
                onComplete={(txData) => {
                  setShowTransactionSteps(false)
                  onTransactionConfirm && onTransactionConfirm(txData)
                }}
                onCancel={() => {
                  setShowTransactionSteps(false)
                  onTransactionCancel && onTransactionCancel()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCodeEditor && message.contractCode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <CodeEditor
                initialCode={message.contractCode}
                onDeploy={handleDeploymentStart}
                onCancel={() => {
                  setShowCodeEditor(false)
                  onCodeCancel && onCodeCancel()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeploymentStepper && message.contractCode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ContractDeploymentStepper
                contractCode={message.contractCode}
                isActive={showDeploymentStepper}
                onComplete={(deployData) => {
                  setShowDeploymentStepper(false)
                  onCodeDeploy && onCodeDeploy(deployData)
                }}
                onCancel={() => {
                  setShowDeploymentStepper(false)
                  onCodeCancel && onCodeCancel()
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBalance && message.balanceAddress && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <BalanceDisplay address={message.balanceAddress} onRefresh={() => console.log("Refreshing balances...")} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSwap && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <TokenSwap
                onSwap={(swapData) => {
                  setShowSwap(false)
                  onSwap && onSwap(swapData)
                }}
                fromToken={message.fromToken}
                toToken={message.toToken}
                amount={message.amount}
                onCancel={() => setShowSwap(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBridge && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <BridgeInterface
                onBridge={(bridgeData) => {
                  setShowBridge(false)
                  onBridge && onBridge(bridgeData)
                }}
                onCancel={() => setShowBridge(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const AIChat = ({ prompt, setPrompt, messages, isLoading, onSubmit }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTransactionConfirm = (txData) => {
    const confirmationMessage = {
      content: `✅ Transaction confirmed!\n\nTransaction Hash: ${txData.contractAddress || "0x1234...abcd"}\nAmount: ${txData.amount} ${txData.token}\nStatus: Success`,
      timestamp: new Date().toISOString(),
      isAi: true,
    }
    // In real implementation, you would update the messages state through a parent component
    console.log("Transaction confirmed:", txData)
  }

  const handleTransactionCancel = () => {
    const cancelMessage = {
      content: "Transaction cancelled by user.",
      timestamp: new Date().toISOString(),
      isAi: true,
    }
    console.log("Transaction cancelled")
  }

  const handleCodeDeploy = (deployData) => {
    const deployMessage = {
      content: `🚀 Smart contract deployed successfully!\n\nContract Address: ${deployData.contractAddress}\nNetwork: Ethereum Mainnet\nGas Used: 2,100,000\n\nYour contract is now live on the blockchain!`,
      timestamp: new Date().toISOString(),
      isAi: true,
    }
    console.log("Contract deployed:", deployData)
  }

  const handleCodeCancel = () => {
    const cancelMessage = {
      content: "Contract deployment cancelled.",
      timestamp: new Date().toISOString(),
      isAi: true,
    }
    console.log("Deployment cancelled")
  }

  const handleSwap = (swapData) => {
    console.log("Token swap initiated:", swapData)
  }

  const handleBridge = (bridgeData) => {
    console.log("Bridge transaction initiated:", bridgeData)
  }

  return (
    <>
      <motion.div
        className="flex flex-col h-[70vh] mx-auto mb-4 rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.2 } }}
      >
        <div className="flex items-center gap-2 px-3 text-gray-500">
          Today
          <span className="flex-1 w-auto">
            <hr />
          </span>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Start a conversation by sending a message below!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                isAi={message.isAi}
                onTransactionConfirm={handleTransactionConfirm}
                onTransactionCancel={handleTransactionCancel}
                onCodeDeploy={handleCodeDeploy}
                onCodeCancel={handleCodeCancel}
                onSwap={handleSwap}
                onBridge={handleBridge}
              />
            ))
          )}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-[#dedbda] rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      <AIPrompt
        onSubmit={onSubmit}
        placeholder="Ask about blockchain operations, transactions, or smart contracts..."
        query={prompt}
        setQuery={setPrompt}
      />
    </>
  )
}

export default AIChat
