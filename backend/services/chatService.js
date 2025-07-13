import { GoogleGenAI } from '@google/genai';
import { extractIntent } from '../utils/intentExtractor.js';
import { executeMCPQuery } from './mcpService.js';
import { generateChartData } from '../utils/chartGenerator.js';

/**
 * Process a chat message and return AI response with potential chart data
 * @param {string} message - User's natural language message
 * @param {string} sessionId - Session identifier
 * @returns {Object} Response with text and optional chart data
 */
export async function processChatMessage(message, sessionId) {
  try {
    // Step 1: Extract intent and parameters from the message
    const intent = await extractIntent(message);
    // TODO: remove log
    console.log('[+] intent\n', intent);
    
    // Step 2: If intent requires blockchain data, fetch it via MCP
    let blockchainData = null;
    if (intent.requiresData) {
      blockchainData = await executeMCPQuery(intent);
    }
    console.log('[+] data\n', blockchainData);

    // Step 3: Generate AI response with context
    const aiResponse = await generateAIResponse(message, intent, blockchainData);

    // Step 4: Generate chart data if applicable
    let chartData = null;
    if (blockchainData && intent.chartType) {
      chartData = generateChartData(blockchainData, intent.chartType);
    }

    return {
      message: aiResponse,
      chartData,
      intent: intent.type,
      timestamp: new Date().toISOString(),
      sessionId
    };

  } catch (error) {
    console.error('Error processing chat message:', error);
    throw new Error('Failed to process chat message');
  }
}

/**
 * Generate AI response using Google Gemini
 * @param {string} userMessage - Original user message
 * @param {Object} intent - Extracted intent
 * @param {Object} blockchainData - Blockchain data from MCP
 * @returns {string} AI generated response
 */
async function generateAIResponse(userMessage, intent, blockchainData) {
  try {
    // Initialize Google Generative AI client with API key
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `You are GraphDe, an AI assistant that helps users understand blockchain data through natural language queries. 

Your capabilities include:
- Analyzing wallet balances and transaction history
- Creating charts and graphs for blockchain data
- Explaining complex blockchain concepts in simple terms
- Providing insights about token distributions and trading volumes

When responding:
- Be conversational and helpful
- If blockchain data is provided, explain it clearly
- Suggest relevant charts or visualizations when appropriate
- Keep responses concise but informative

Current context:
- Intent: ${intent.type}
- Parameters: ${JSON.stringify(intent.parameters)}
${blockchainData ? `- Data available: ${JSON.stringify(blockchainData, null, 2)}` : ''}`;

    const prompt = `${systemPrompt}\n\nUser message: ${userMessage}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;

  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

/**
 * Get chat history for a session (placeholder for future database integration)
 * @param {string} sessionId - Session identifier
 * @returns {Array} Chat history
 */
export async function getChatHistory(sessionId) {
  // Placeholder - in a real app, this would fetch from database
  return [];
}

/**
 * Save chat message to history (placeholder for future database integration)
 * @param {string} sessionId - Session identifier
 * @param {Object} message - Message object
 */
export async function saveChatMessage(sessionId, message) {
  // Placeholder - in a real app, this would save to database
  console.log('Saving message:', { sessionId, message });
} 