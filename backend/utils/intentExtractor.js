import { GoogleGenAI } from '@google/genai';

/**
 * Extract intent and parameters from natural language message
 * @param {string} message - User's natural language message
 * @returns {Object} Extracted intent with parameters
 */
export async function extractIntent(message) {
  try {
    // Initialize Google Generative AI client with API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `
    You are an intent extraction system for a blockchain data analytics platform. Your role is to analyze a user's natural language question and generate a structured JSON object that maps the user's intent to a backend API call (MCP). Your output must strictly follow the format below and contain only a raw JSON object, with no explanations, markdown, or comments.
    {
      "category": "one_of_supported_categories_or_null",
      "method": "one_of_supported_methods",
      "chain": "blockchain_name_or_null",
      "address": "wallet_address_or_null",
      "chartType": "chart_type_if_applicable_or_null",
      "params": {},
      "requiresData": true_or_false
    }

    Field Descriptions
      category: 
        The API category to use. Must be one of: "node", "web3", "net", "debug", or null. Set to null only when method is "general_question".
      method: 
        The API method to call. Must be one of:
      "wallet_balance": 
        Retrieves the native coin balance of a wallet.
      "token_balance": 
        Retrieves all token balances of a wallet.
      "transaction_history": 
        Retrieves the transaction history of a wallet.
      "general_question": 
        Handles informational or conceptual questions not requiring blockchain data.
      chain: 
        The blockchain network to query. Must be one of: "ethereum", "arbitrum", "optimism", "aptos", "avalanche", "base", "kaia", "polygon". Set to null only if method is "general_question".
      address: 
        The wallet address to analyze (e.g., "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"). Set to null if no wallet address is provided or if method is "general_question".
      chartType: 
        The type of chart for visual output, if explicitly requested. Must be one of: "line", "bar", "pie", "area", "scatter". Set to null if no chart is requested or implied.
      params: 
        A JSON object containing parameters specific to the selected method. Use an empty object ({}) if no additional parameters are required. Future expansions may include parameters like token symbols or date ranges.
      requiresData: Set to true if the query requires on-chain data (i.e., method is "wallet_balance", "token_balance", or "transaction_history"). Set to false only when method is "general_question".
    
    Special Rules
      If method is "general_question", the output must be:
      {
        "category": null,
        "method": "general_question",
        "chain": null,
        "address": null,
        "chartType": null,
        "params": {},
        "requiresData": false
      }

      If no blockchain is specified but a wallet address is provided, default to "ethereum" for chain unless the context clearly indicates another supported blockchain.
      If the user's query is ambiguous or lacks sufficient information (e.g., missing wallet address for a data query), set address to null and include no additional parameters in params.
      Ensure the wallet address is valid for the specified or inferred blockchain. If invalid or unspecified, set address to null.
    
    Response Instructions
      Output only a raw JSON object starting with { and ending with }.
      Do not include explanations, markdown, code blocks, or any text outside the JSON object.
      If the query implies a chart (e.g., words like "plot", "graph", "chart"), select the most appropriate chartType based on the query context (e.g., "pie" for token balances, "line" for transaction history over time).
      If the query is unclear or cannot be mapped to a supported method, default to "general_question".

    Examples
      Query: "Show me the ETH balance of 0x742d… on Ethereum"
      {
        "category": "node",
        "method": "wallet_balance",
        "chain": "ethereum",
        "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        "chartType": null,
        "params": {},
        "requiresData": true
      }
      
      Query: "Plot a pie chart of tokens held by this wallet: 0x742d…"
      {
        "category": "node",
        "method": "token_balance",
        "chain": "ethereum",
        "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        "chartType": "pie",
        "params": {},
        "requiresData": true
      }

      Query: "What is a blockchain?"
      {
        "category": null,
        "method": "general_question",
        "chain": null,
        "address": null,
        "chartType": null,
        "params": {},
        "requiresData": false
      }

      Query: "Show transaction history for 0x123… on Polygon"
      {
        "category": "node",
        "method": "transaction_history",
        "chain": "polygon",
        "address": "0x1234567890abcdef1234567890abcdef12345678",
        "chartType": null,
        "params": {},
        "requiresData": true
      }
    `;

    const prompt = `${systemPrompt}\n\nUser message: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const responseText = response.text;
    
    // Parse the JSON response
    const intent = JSON.parse(responseText);
    
    // Validate the extracted intent
    return validateIntent(intent);

  } catch (error) {
    console.error('Error extracting intent:', error);
    
    // Return a fallback intent for general questions
    return {
      type: 'general_question',
      parameters: {},
      requiresData: false,
      chartType: null
    };
  }
}

/**
 * Validate extracted intent
 * @param {Object} intent - Extracted intent
 * @returns {Object} Validated intent
 */
function validateIntent(intent) {
  const validTypes = ['wallet_balance', 'token_balance', 'transaction_history', 'custom_query', 'general_question'];
  const validChains = ['ethereum', 'arbitrum', 'optimism', 'aptos', 'avalanche', 'base', 'kaia', 'polygon'];
  const validChartTypes = ['line', 'bar', 'pie', 'area', 'scatter'];

  // Ensure required fields exist
  if (!intent.type || !validTypes.includes(intent.type)) {
    intent.type = 'general_question';
  }

  if (!intent.parameters) {
    intent.parameters = {};
  }

  if (typeof intent.requiresData !== 'boolean') {
    intent.requiresData = false;
  }

  // Validate chain if present
  if (intent.parameters.chain && !validChains.includes(intent.parameters.chain)) {
    intent.parameters.chain = 'ethereum'; // Default to ethereum
  }

  // Validate address format if present
  if (intent.parameters.address && !isValidAddress(intent.parameters.address)) {
    delete intent.parameters.address;
  }

  // Validate chart type if present
  if (intent.chartType && !validChartTypes.includes(intent.chartType)) {
    intent.chartType = null;
  }

  return intent;
}

/**
 * Check if address is valid Ethereum format
 * @param {string} address - Address to validate
 * @returns {boolean} Is valid
 */
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
} 