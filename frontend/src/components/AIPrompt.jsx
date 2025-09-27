"use client"

import { Mic, Plus, Zap } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function AIPrompt({ query, setQuery, setStarted, onSubmit, placeholder = "Message Copilot" }) {
  const [mode, setMode] = useState("Quick response")

  function handleSubmit(e) {
    e.preventDefault()
    console.log("[v0] Submitted:", { query, mode })
    setStarted && setStarted(true)
    onSubmit && onSubmit(query)
    setQuery("")
  }

  return (
    <motion.form
      layoutId="input-box"
      onSubmit={handleSubmit}
      className="mx-auto w-full rounded-2xl shadow-2xl p-1.5 bg-gradient-to-b from-[#dedbda] to-[#f9f7f6]"
      role="search"
      aria-label="Message Copilot"
    >
      <div className="items-center gap-2 md:gap-3 px-3 md:px-4 pt-2 bg-[#f9f7f6] rounded-xl">
        <input
          id="mc-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/70 text-base py-2 w-full"
        />

        <div className="flex justify-between">
          {/* Leading colorful mark */}
          <span
            aria-hidden
            className="inline-block size-6 rounded-md"
            style={{
              background: "conic-gradient(from 45deg, #ff7a7a, #f8bf3f, #4fe3a3, #5aa9ff, #c07bff, #ff7a7a)",
            }}
          />

          {/* Actions */}
          <div className="space-x-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Quick blockchain action"
              className="rounded-full p-2 hover:bg-accent text-foreground/70 hover:text-foreground hover:bg-[#c6c2c2] transition-colors"
            >
              <Zap className="size-5" aria-hidden="true" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Add attachment"
              className="rounded-full p-2 hover:bg-accent text-foreground/70 hover:text-foreground hover:bg-[#c6c2c2] transition-colors"
            >
              <Plus className="size-5" aria-hidden="true" />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Voice input"
              className="rounded-full p-2 hover:bg-accent text-foreground/70 hover:text-foreground hover:bg-[#c6c2c2] transition-colors"
            >
              <Mic className="size-5" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  )
}
