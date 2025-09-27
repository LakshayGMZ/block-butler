# Block Butler Frontend

This is the frontend for Block Butler

## Features implemented using natural language
- Fetch Wallet Balances
- send transactions
- swaps
- creation and deployment of Smart contracts

## Getting Started

### Prerequisites
- backend
- Infura API key (for ETH balance fetching)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Set up environment variables (.env file)
   ```
   VITE_PUBLIC_API_BASE_URL=http://localhost:5000
   VITE_INFURA_API_KEY=your_infura_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

