
"use client"

import { useState } from "react"
import AIChat from "@/components/AIChat"
import LandingPage from "./components/LandingPage"
import Header from "./components/Header"
import { useAccount } from "wagmi"

// Define a type for messages
interface ChatMessage {
  content: string
  timestamp: string
  isAi: boolean
  showTransaction?: boolean
  transactionData?: {
    from: string
    to: string
    amount: string
    token: string
    gasFee: string
    total: string
  }
  showCodeEditor?: boolean
  contractCode?: string
  showBalance?: boolean
  balanceData?: {
    symbol: string
    name: string
    balance: string
    value: number
  }[]
  showSwap?: boolean
  showBridge?: boolean
}

function App() {
  const [prompt, setPrompt] = useState("")
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()

  const handleSubmit = (prompt: string) => {
    if (!prompt.trim()) return

    setStarted(true)

    const userMessage: ChatMessage = {
      content: prompt,
      timestamp: new Date().toISOString(),
      isAi: false,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        content: `This is a simulated response to: "${prompt}"\n\nIn a real implementation, this would be replaced with an actual API call to your AI backend.`,
        timestamp: new Date().toISOString(),
        isAi: true,
      }

      const lowerPrompt = prompt.toLowerCase()

      // Transaction-related prompts
      if (lowerPrompt.includes("transaction") || lowerPrompt.includes("send") || lowerPrompt.includes("transfer")) {
        aiResponse.showTransaction = true
        aiResponse.transactionData = {
          from: address ?? "",
          to: "0x37Fcd6f3a0205076b6Be130f26b55652e4d28187",
          amount: "0.05",
          token: "ETH",
          gasFee: "21000",
          total: "0.502",
        }
      }

      // Smart contract prompts
      if (
        lowerPrompt.includes("contract") ||
        lowerPrompt.includes("deploy") ||
        lowerPrompt.includes("smart contract")
      ) {
        aiResponse.showCodeEditor = true
        aiResponse.contractCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ${prompt.includes("token") ? "SimpleToken" : "SimpleStorage"} {
    // Generated based on your request
    // Edit this code as needed
}`
      }

      // Balance-related prompts
      if (lowerPrompt.includes("balance") || lowerPrompt.includes("wallet") || lowerPrompt.includes("assets")) {
        aiResponse.showBalance = true
        aiResponse.balanceData = [
          { symbol: "ETH", name: "Ethereum", balance: "1.234", value: 3085.5 },
          { symbol: "USDC", name: "USD Coin", balance: "2,456.78", value: 2456.78 },
          { symbol: "MATIC", name: "Polygon", balance: "1,000.00", value: 850.0 },
        ]
      }

      // Swap-related prompts
      if (lowerPrompt.includes("swap") || lowerPrompt.includes("exchange") || lowerPrompt.includes("trade")) {
        aiResponse.showSwap = true
        aiResponse.content = "I'll help you swap tokens. Please review the details below and confirm when ready."
      }

      // Bridge-related prompts
      if (
        lowerPrompt.includes("bridge") ||
        lowerPrompt.includes("cross-chain") ||
        lowerPrompt.includes("polygon") ||
        lowerPrompt.includes("arbitrum")
      ) {
        aiResponse.showBridge = true
        aiResponse.content =
          "I'll help you bridge tokens across chains. Please configure your bridge transaction below."
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#f7f3f2] text-black">
      <Header />

      <div className={`py-12 px-4 sm:px-6 lg:px-8 ${!started ? "content-center" : ""}`}>
        {!started ? (
          <div className="max-w-4xl mx-auto">
            <LandingPage query={prompt} setQuery={setPrompt} onSubmit={handleSubmit} />
          </div>
        ) : (
          <div className="w-[min(800px,80%)] mx-auto">
            <AIChat
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleSubmit}
              messages={messages}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App

