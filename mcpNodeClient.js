// mcpNodeClient.js
import axios from 'axios';

const NODIT_API_KEY = "";

const mcp_nodeUrls = {
  ethereum: 'https://ethereum-mainnet.nodit.io/',
  arbitrum: 'https://arbitrum-mainnet.nodit.io/',
  optimism: 'https://optimism-mainnet.nodit.io/',
  aptos: 'https://aptos-mainnet.nodit.io/',
  avalanche: 'https://avalanche-mainnet.nodit.io/',
  base: 'https://base-mainnet.nodit.io/',
  kaia: 'https://kaia-mainnet.nodit.io/',
  polygon: 'https://polygon-mainnet.nodit.io/',
};

let reqId = 0;

/**
 * Send a node-level JSON-RPC request to MCP.
 * 
 * @param {Object} options
 * @param {string} options.type - Must be 'node'
 * @param {string} options.chain - 'ethereum', 'arbitrum', etc.
 * @param {string} options.category - 'eth', 'net', 'web3', etc.
 * @param {string} options.method - method name like 'blockNumber'
 * @param {Array} options.params - array of parameters for the method
 * @returns {Promise<Object>} JSON-RPC response result
 */
export async function send_node_Request({ type, chain, category, method, params }) {
  if (type !== 'node') {
    throw new Error(`Unsupported request type: ${type}`);
  }

  const rpcMethod = `${category}_${method}`;
  const url = mcp_nodeUrls[chain];
  if (!url) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const data = {
    id: reqId++,
    jsonrpc: '2.0',
    method: rpcMethod,
    params: params || []
  };

  const config = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': NODIT_API_KEY
    },
    data
  };

  try {
    const response = await axios.request(config);
    return response.data; 
  } catch (error) {
    console.error('MCP node request error:', error.message);
    throw error;
  }
}
