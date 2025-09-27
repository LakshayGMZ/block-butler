"use client"
import AIPrompt from "./AIPrompt"

const suggestions = [
  "Check my wallet balance",
  "Send 0.1 ETH to address",
  "Deploy a simple token contract",
  "Swap ETH for USDC",
  "Bridge tokens to Polygon",
  "Create a NFT contract",
  "Check gas prices",
  "Explain DeFi protocols",
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
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleChipClick(s)}
            className="rounded-lg border-[1px] border-[#dedbda] bg-[#faf8f7] px-3 py-2 text-sm text-black/80 hover:bg-accent transition-colors"
            aria-label={`Use suggestion: ${s}`}
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  )
}
