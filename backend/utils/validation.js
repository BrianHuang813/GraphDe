import Joi from 'joi';

/**
 * Validate chat message request
 * @param {Object} data - Request data
 * @returns {Object} Validation result
 */
export function validateChatMessage(data) {
  const schema = Joi.object({
    message: Joi.string().required().min(1).max(1000),
    sessionId: Joi.string().optional().max(100)
  });

  const { error, value } = schema.validate(data);
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : [],
    value
  };
}

/**
 * Validate MCP request
 * @param {Object} data - Request data
 * @returns {Object} Validation result
 */
export function validateMCPRequest(data) {
  const schema = Joi.object({
    chain: Joi.string().valid('ethereum', 'arbitrum', 'optimism', 'aptos', 'avalanche', 'base', 'kaia', 'polygon').required(),
    address: Joi.string().pattern(/^0x[a-fA-F0-9]{40}$/).required(),
    category: Joi.string().optional(),
    method: Joi.string().optional()
  });

  const { error, value } = schema.validate(data);
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : [],
    value
  };
}

/**
 * Validate wallet address format
 * @param {string} address - Wallet address
 * @returns {boolean} Is valid
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate chain name
 * @param {string} chain - Chain name
 * @returns {boolean} Is valid
 */
export function isValidChain(chain) {
  const validChains = ['ethereum', 'arbitrum', 'optimism', 'aptos', 'avalanche', 'base', 'kaia', 'polygon'];
  return validChains.includes(chain);
} 