
"use client"

import { useState } from "react"
import AIChat from "@/components/AIChat"
import LandingPage from "./components/LandingPage"
import Header from "./components/Header"
import { useAccount } from "wagmi"
import axios from "axios"

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
    gasFee?: string
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
  balanceAddress?: string
  showSwap?: boolean
  swapData?: {
    fromToken: string
    toToken: string
    amount: number
    slippage?: string
  }
  showBridge?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
})

function App() {
  const [prompt, setPrompt] = useState("")
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // const { address } = useAccount()

  const handleSubmit = (prompt: string) => {
    if (!prompt.trim()) return

    setStarted(true)
    setIsLoading(true)
    
    const userMessage: ChatMessage = {
      content: prompt,
      timestamp: new Date().toISOString(),
      isAi: false,
    }
    setMessages((prev) => [...prev, userMessage])

    api.post("/generate", { message: prompt })
      .then(res => res.data)
      .then(data => {
        console.log("Response from backend:", data);
        const aiResponse: ChatMessage = {
          content: data.generatedContent,
          timestamp: new Date().toISOString(),
          isAi: true,
        }
        
        const action = data.actionType
          
        // Transaction-related prompts
        if (action === "transaction") {
          aiResponse.showTransaction = true
          aiResponse.transactionData = {
            from: data.fromAddress,
            to: data.toAddress,
            amount: data.amountETH
          }
        }
  
        // Smart contract prompts
        if (action === "deploy_contract") {
          aiResponse.showCodeEditor = true
          aiResponse.contractCode = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;
  
  contract ${prompt.includes("token") ? "SimpleToken" : "SimpleStorage"} {
      // Generated based on your request
      // Edit this code as needed
  }`
        }
  
        // Balance-related prompts
        if (action === "balance") {
          aiResponse.showBalance = true
          aiResponse.balanceAddress = data.address
        }
  
        // Swap-related prompts
        if (action === "swap") {
          aiResponse.showSwap = true
          aiResponse.swapData = {
            fromToken: data.fromTokenAddress,
            toToken: data.toTokenAddress,
            amount: data.amount
          }
        }

        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false); 
      });
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

