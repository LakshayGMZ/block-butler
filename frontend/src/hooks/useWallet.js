"use client"

import { useState, useEffect, useCallback } from "react"
import { web3Utils } from "../utils/web3"

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0.00")
  const [chainId, setChainId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Connect wallet
  const connect = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await web3Utils.connectWallet()

      if (result.success) {
        setIsConnected(true)
        setAddress(result.address)
        setChainId(result.chainId)

        // Get balance
        const userBalance = await web3Utils.getBalance(result.address)
        if (userBalance) {
          setBalance(userBalance)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setIsConnected(false)
    setAddress("")
    setBalance("0.00")
    setChainId(null)
    setError(null)
  }, [])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!address) return

    try {
      const userBalance = await web3Utils.getBalance(address)
      if (userBalance) {
        setBalance(userBalance)
      }
    } catch (err) {
      console.error("Failed to refresh balance:", err)
    }
  }, [address])

  // Send transaction
  const sendTransaction = useCallback(
    async (to, value) => {
      if (!isConnected) throw new Error("Wallet not connected")

      setIsLoading(true)
      try {
        const result = await web3Utils.sendTransaction(to, value)
        if (result.success) {
          // Refresh balance after successful transaction
          setTimeout(refreshBalance, 2000)
        }
        return result
      } finally {
        setIsLoading(false)
      }
    },
    [isConnected, refreshBalance],
  )

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect()
        } else if (accounts[0] !== address) {
          setAddress(accounts[0])
          refreshBalance()
        }
      }

      const handleChainChanged = (newChainId) => {
        setChainId(newChainId)
        refreshBalance()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address, disconnect, refreshBalance])

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0])
            setChainId(await web3Utils.getChainId())

            const userBalance = await web3Utils.getBalance(accounts[0])
            if (userBalance) {
              setBalance(userBalance)
            }
          }
        } catch (err) {
          console.error("Failed to check wallet connection:", err)
        }
      }
    }

    checkConnection()
  }, [])

  return {
    isConnected,
    address,
    balance,
    chainId,
    isLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
    sendTransaction,
  }
}
