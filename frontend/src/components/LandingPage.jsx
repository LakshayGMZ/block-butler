"use client"
import AIPrompt from "./AIPrompt"

const suggestions = [
  { label: "Check my wallet balance", value: "Check my wallet balance 0xDF48E7a870b8822B83A9A5F45b959403ac7D7143" },
  { label: "Send 0.001 ETH to address", value: "send 0.001 ETH from 0xDF48E7a870b8822B83A9A5F45b959403ac7D7143 to 0x37Fcd6f3a0205076b6Be130f26b55652e4d28187" },
  { label: "Deploy a simple token contract", value: "Deploy a simple token contract" },
  { label: "Swap ETH for USDC", value: "Buy 5.3 USDC" },
  { label: "Bridge tokens to Polygon", value: "Bridge tokens to Polygon" },
  { label: "Create a NFT contract", value: "Create a NFT contract" },
  { label: "Check gas prices", value: "Check gas prices" },
  { label: "Explain DeFi protocols", value: "Explain DeFi protocols" },
]

export default function LandingPage({ query, setQuery, onSubmit }) {
  function handleChipClick(text) {
    setQuery(text)
  }

  return (
    <section aria-labelledby="hero-heading" className="w-full max-w-4xl mx-auto">
      <header className="ml-4 mb-6">
        <h1 id="hero-heading" className="text-balance font-medium text-2xl">
          Hey, nice to see you. What's new?
        </h1>
        <p className="text-gray-600 mt-2">
          I can help you with blockchain operations, smart contracts, and DeFi interactions.
        </p>
      </header>

      <AIPrompt query={query} setQuery={setQuery} onSubmit={onSubmit} />

      {/* Suggestion chips */}
      <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
        {suggestions.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleChipClick(value)}
            className="rounded-lg border-[1px] border-[#dedbda] bg-[#faf8f7] px-3 py-2 text-sm text-black/80 hover:bg-[#fff] transition-colors cursor-pointer"
            aria-label={`Use suggestion: ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
