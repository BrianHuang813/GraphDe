// services/mcpService.js
import { send_web3_RpcRequest } from "../mcpWeb3Client.js";
import { send_node_Request } from "../mcpNodeClient.js";

const SUPPORTED_CHAINS = [
  "ethereum",
  "arbitrum",
  "optimism",
  "aptos",
  "avalanche",
  "base",
  "kaia",
  "polygon",
  "xrpl",
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
      category: "native",
      method: "getNativeBalanceByAccount",
      accountAddress: address,
      NODIT_API_KEY: process.env.NODIT_API_KEY,
    });

    return {
      chain,
      address,
      balance: response.result || response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
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
      category: "erc20",
      method: "getTokenBalancesByAccount",
      accountAddress: address,
      NODIT_API_KEY: process.env.NODIT_API_KEY,
    });

    return {
      chain,
      address,
      tokens: response.result || response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching token data:", error);
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

    const response = await send_web3_RpcRequest({
      chain,
      category: "blockchain",
      method: "getTransactionsByAccount",
      accountAddress: address,
      limit,
      offset,
      NODIT_API_KEY: process.env.NODIT_API_KEY,
    });

    return {
      chain,
      address,
      transactions: response.result || response,
      pagination: { limit, offset, total: response.total || 0 },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new Error(`Failed to fetch transactions for ${address} on ${chain}`);
  }
}

/**
 * Get token allowance for a specific contract, owner, and spender
 * @param {string} chain - Blockchain network
 * @param {string} contractAddress - Token contract address
 * @param {string} ownerAddress - Token owner address
 * @param {string} spenderAddress - Token spender address
 * @returns {Object} Token allowance data
 */
export async function getTokenAllowance(
  chain,
  contractAddress,
  ownerAddress,
  spenderAddress
) {
  try {
    validateChain(chain);
    validateAddress(contractAddress);
    validateAddress(ownerAddress);
    validateAddress(spenderAddress);

    const response = await send_web3_RpcRequest({
      chain,
      category: "token",
      method: "getTokenAllowance",
      contractAddress,
      ownerAddress,
      spenderAddress,
      NODIT_API_KEY: process.env.NODIT_API_KEY,
    });

    return {
      chain,
      contractAddress,
      ownerAddress,
      spenderAddress,
      allowance: response.allowance || response.result || response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching token allowance:", error);
    throw new Error(
      `Failed to fetch token allowance for contract ${contractAddress}`
    );
  }
}

/**
 * Get token balance changes by account (XRPL specific)
 * @param {string} chain - Blockchain network (must be 'xrpl')
 * @param {Object} params - Query parameters
 * @returns {Object} Token balance changes data
 */
export async function getTokenBalanceChangesByAccount(chain, params) {
  try {
    validateChain(chain);
    validateXRPLAddress(params.accountAddress);

    const response = await send_web3_RpcRequest({
      chain,
      category: "token",
      method: "getTokenBalanceChangesByAccount",
      ...params,
      NODIT_API_KEY: process.env.NODIT_API_KEY,
    });

    return {
      chain,
      accountAddress: params.accountAddress,
      data: response.items || response.result || response,
      pagination: {
        page: response.page,
        rpp: response.rpp,
        cursor: response.cursor,
        count: response.count,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching token balance changes:", error);
    throw new Error(
      `Failed to fetch token balance changes for account ${params.accountAddress}`
    );
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
      case "wallet_balance":
        return await getWalletBalance(parameters.chain, parameters.address);

      case "token_balance":
        return await getTokenData(parameters.chain, parameters.address);

      case "transaction_history":
        return await getTransactionHistory(
          parameters.chain,
          parameters.address,
          parameters.options
        );

      case "token_allowance":
        return await getTokenAllowance(
          parameters.chain,
          parameters.contractAddress,
          parameters.ownerAddress,
          parameters.spenderAddress
        );

      case "token_balance_changes":
        return await getTokenBalanceChangesByAccount(
          parameters.chain,
          parameters
        );

      case "custom_query":
        return await executeCustomQuery(parameters);

      default:
        throw new Error(`Unsupported intent type: ${type}`);
    }
  } catch (error) {
    console.error("Error executing MCP query:", error);
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
      type: "node",
      chain,
      category,
      method,
      params: params || [],
      NODIT_API_KEY: process.env.NODIT_API_KEY,
    });

    return {
      chain,
      category,
      method,
      result: response.result || response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error executing custom query:", error);
    throw error;
  }
}

/**
 * Validate blockchain chain
 * @param {string} chain - Chain name
 */
function validateChain(chain) {
  if (!SUPPORTED_CHAINS.includes(chain)) {
    throw new Error(
      `Unsupported chain: ${chain}. Supported chains: ${SUPPORTED_CHAINS.join(
        ", "
      )}`
    );
  }
}

/**
 * Validate wallet address format
 * @param {string} address - Wallet address
 */
function validateAddress(address) {
  if (!address || typeof address !== "string") {
    throw new Error("Invalid address provided");
  }

  // Basic Ethereum address validation
  if (address.length !== 42 || !address.startsWith("0x")) {
    throw new Error("Invalid Ethereum address format");
  }
}

/**
 * Validate XRPL address format
 * @param {string} address - XRPL address
 */
function validateXRPLAddress(address) {
  if (!address || typeof address !== "string") {
    throw new Error("Invalid XRPL address provided");
  }

  // XRPL address validation: 25-35 characters, starts with 'r'
  if (address.length < 25 || address.length > 35 || !address.startsWith("r")) {
    throw new Error("Invalid XRPL address format");
  }
}

/**
 * Get supported chains
 * @returns {Array} List of supported chains
 */
export function getSupportedChains() {
  return SUPPORTED_CHAINS;
}
