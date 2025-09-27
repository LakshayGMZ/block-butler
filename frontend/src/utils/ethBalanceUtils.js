// Ethereum balance utility functions using ethers.js
import { ethers } from 'ethers';

  const INFURA_API_KEY = import.meta.env?.VITE_INFURA_API_KEY || '9e98e77ae8ac4083bb1fb0a8d5b2cbf5';

/**
 * Fetch ETH balance for a given address using Infura API
 * @param {string} address - Ethereum address to fetch balance for
 * @returns {Promise<string>} - ETH balance formatted to 4 decimal places
 */
export const fetchETHBalance = async (address) => {
  if (!address) {
    console.error('No address provided for balance fetch');
    return '0.0000';
  }

  try {
    // Create provider using Infura
    const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);

    // Fetch the balance
    const balance = await provider.getBalance(address);

    // Convert to ETH and format to 4 decimal places
    const ethBalance = ethers.formatEther(balance);
    return parseFloat(ethBalance).toFixed(4);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0.0000';
  }
};

/**
 * Fetch token balances for a given address
 * This is a placeholder for future token balance fetching functionality
 * @param {string} address - Ethereum address to fetch token balances for
 * @returns {Promise<Array>} - Array of token balances
 */
export const fetchTokenBalances = async (address) => {
  // This would be implemented in the future to fetch ERC20 token balances
  // For now, return an empty array
  return [];
};
