import { send_web3_RpcRequest } from '../mcpWeb3Client.js';
import { send_node_Request } from '../mcpNodeClient.js';

const SUPPORTED_CHAINS = [
  'ethereum', 'arbitrum', 'optimism', 'aptos', 
  'avalanche', 'base', 'kaia', 'polygon'
];

/**
 * Get wallet balance for a specific chain and address
 * @param {string} chain - Blockchain network
 * @param {string} address - Wallet address
 * @returns {Object} Balance data
 */
export async function getWalletBalance(chain, address) {
  try {
    validateChain(chain);
    validateAddress(address);

    const response = await send_web3_RpcRequest({
      chain,
      category: 'native',
      method: 'getNativeBalanceByAccount',
      accountAddress: address,
      NODIT_API_KEY: process.env.NODIT_API_KEY
    });

    return {
      chain,
      address,
      balance: response.result || response,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw new Error(`Failed to fetch balance for ${address} on ${chain}`);
  }
}

/**
 * Get token data for a specific chain and address
 * @param {string} chain - Blockchain network
 * @param {string} address - Wallet address
 * @returns {Object} Token data
 */
export async function getTokenData(chain, address) {
  try {
    validateChain(chain);
    validateAddress(address);

    const response = await send_web3_RpcRequest({
      chain,
      category: 'erc20',
      method: 'getTokenBalancesByAccount',
      accountAddress: address,
      NODIT_API_KEY: process.env.NODIT_API_KEY
    });

    return {
      chain,
      address,
      tokens: response.result || response,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching token data:', error);
    throw new Error(`Failed to fetch tokens for ${address} on ${chain}`);
  }
}

/**
 * Get transaction history for a specific chain and address
 * @param {string} chain - Blockchain network
 * @param {string} address - Wallet address
 * @param {Object} options - Query options
 * @returns {Object} Transaction history
 */
export async function getTransactionHistory(chain, address, options = {}) {
  try {
    validateChain(chain);
    validateAddress(address);

    const { limit = 50, offset = 0 } = options;

    // This would use a more specific MCP method for transaction history
    // For now, return a placeholder response
    return {
      chain,
      address,
      transactions: [],
      pagination: { limit, offset, total: 0 },
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw new Error(`Failed to fetch transactions for ${address} on ${chain}`);
  }
}

/**
 * Execute a custom MCP query based on extracted intent
 * @param {Object} intent - Extracted intent with parameters
 * @returns {Object} Query result
 */
export async function executeMCPQuery(intent) {
  try {
    const { type, parameters } = intent;

    switch (type) {
      case 'wallet_balance':
        return await getWalletBalance(parameters.chain, parameters.address);
      
      case 'token_balance':
        return await getTokenData(parameters.chain, parameters.address);
      
      case 'transaction_history':
        return await getTransactionHistory(parameters.chain, parameters.address, parameters.options);
      
      case 'custom_query':
        return await executeCustomQuery(parameters);
      
      default:
        throw new Error(`Unsupported intent type: ${type}`);
    }

  } catch (error) {
    console.error('Error executing MCP query:', error);
    throw error;
  }
}

/**
 * Execute a custom query using node-level MCP
 * @param {Object} parameters - Query parameters
 * @returns {Object} Query result
 */
async function executeCustomQuery(parameters) {
  try {
    const { chain, category, method, params } = parameters;

    const response = await send_node_Request({
      type: 'node',
      chain,
      category,
      method,
      params: params || [],
      NODIT_API_KEY: process.env.NODIT_API_KEY
    });

    return {
      chain,
      category,
      method,
      result: response.result || response,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error executing custom query:', error);
    throw error;
  }
}

/**
 * Validate blockchain chain
 * @param {string} chain - Chain name
 */
function validateChain(chain) {
  if (!SUPPORTED_CHAINS.includes(chain)) {
    throw new Error(`Unsupported chain: ${chain}. Supported chains: ${SUPPORTED_CHAINS.join(', ')}`);
  }
}

/**
 * Validate wallet address format
 * @param {string} address - Wallet address
 */
function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address provided');
  }
  
  // Basic Ethereum address validation
  if (address.length !== 42 || !address.startsWith('0x')) {
    throw new Error('Invalid Ethereum address format');
  }
}

/**
 * Get supported chains
 * @returns {Array} List of supported chains
 */
export function getSupportedChains() {
  return SUPPORTED_CHAINS;
} 