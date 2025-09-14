// mcpNodeClient.js
import axios from 'axios';


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



/**
 * Send a node-level JSON-RPC request to MCP.
 * 
 * @param {Object} options
 * @param {string} options.chain - 'ethereum', 'arbitrum', etc.
 * @param {string} options.category - 'eth', 'net', 'web3', , 'debug'etc.
 * @param {string} options.method - method name like 'blockNumber'
 * @param {Array} options.params - array of parameters for the method
 * @returns {Promise<Object>} JSON-RPC response result
 */
export async function send_node_Request({ chain, category, method, params, NODIT_API_KEY }) {
  if (type !== 'node') {
    throw new Error(`Unsupported request type: ${type}`);
  }

  const rpcMethod = `${category}_${method}`;
  const url = mcp_nodeUrls[chain];

  const data = {
    id: 1,
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
