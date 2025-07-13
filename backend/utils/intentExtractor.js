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

    const systemPrompt = `You are an intent extraction system for a blockchain data analysis platform.

Extract the user's intent and parameters from their natural language message. Return a JSON object with the following structure:

{
  "type": "intent_type",
  "parameters": {
    "chain": "blockchain_network",
    "address": "wallet_address",
    "chartType": "chart_type",
    "options": {}
  },
  "requiresData": boolean,
  "chartType": "chart_type_if_applicable"
}

Supported intent types:
- "wallet_balance" - User wants to see wallet balance
- "token_balance" - User wants to see token balances
- "transaction_history" - User wants to see transaction history
- "custom_query" - User wants to execute a custom blockchain query
- "general_question" - User is asking a general question (no blockchain data needed)

Supported chains: ethereum, arbitrum, optimism, aptos, avalanche, base, kaia, polygon

Supported chart types: line, bar, pie, area, scatter

Examples:
- "Show me the balance of 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 on Ethereum" → {"type": "wallet_balance", "parameters": {"chain": "ethereum", "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"}, "requiresData": true, "chartType": null}
- "Graph the top tokens in this wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" → {"type": "token_balance", "parameters": {"chain": "ethereum", "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"}, "requiresData": true, "chartType": "pie"}
- "What is blockchain?" → {"type": "general_question", "parameters": {}, "requiresData": false, "chartType": null}

Your entire response must be only the raw JSON object. Do not wrap it in Markdown fences like \`\`\`json, and do not include any other text or explanations. The response must start with { and end with }.`;

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