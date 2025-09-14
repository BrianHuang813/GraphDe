// mcpWeb3Clientt.js
import axios from 'axios';


const mcp_Web3Urls = {
  ethereum: 'https://web3.nodit.io/v1/ethereum/mainnet/',
  arbitrum: 'https://web3.nodit.io/v1/arbitrum/mainnet/',
  optimism: 'https://web3.nodit.io/v1/optimism/mainnet/',
  aptos: 'https://web3.nodit.io/v1/aptos/mainnet/',
  avalanche: 'https://web3.nodit.io/v1/avalanche/mainnet/',
  base: 'https://web3.nodit.io/v1/base/mainnet/',
  kaia: 'https://web3.nodit.io/v1/kaia/mainnet/',
  polygon: 'https://web3.nodit.io/v1/polygon/mainnet/'
};

/**
 * @param {Object} options
 * @param {string} options.chain - 'ethereum', 'arbitrum', etc.
 * @param {string} options.category - e.g., 'nft', 'token', 'blockchain', 'native', 'ens', 'stats'
 * @param {string} options.method 
 * @param {string} options.accountAddress - user address from frontend
 * @param {string} options.NODIT_API_KEY - 'web3' (currently only 'web3' is supported)
 */
export async function send_web3_RpcRequest({ chain, category, method, accountAddress, NODIT_API_KEY }) {
  if (!accountAddress) throw new Error("accountAddress is required for web3 requests");

  const url = mcp_Web3Urls[chain] + category + '/' + method;

  const data = JSON.stringify({
    accountAddress: accountAddress
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': NODIT_API_KEY
    },
    data
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error('MCP web3 request error:', error.message);
    throw error;
  }
}
