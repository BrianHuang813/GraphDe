import express from 'express';
import { getWalletBalance, getTokenData, getTransactionHistory } from '../services/mcpService.js';
import { validateMCPRequest } from '../utils/validation.js';

const router = express.Router();

/**
 * GET /api/mcp/balance/:chain/:address
 * Get wallet balance for a specific chain and address
 */
router.get('/balance/:chain/:address', async (req, res, next) => {
  try {
    const { chain, address } = req.params;

    // Validate input
    const validation = validateMCPRequest({ chain, address });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    const balance = await getWalletBalance(chain, address);

    res.json({
      success: true,
      data: balance
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/mcp/tokens/:chain/:address
 * Get token data for a specific chain and address
 */
router.get('/tokens/:chain/:address', async (req, res, next) => {
  try {
    const { chain, address } = req.params;

    // Validate input
    const validation = validateMCPRequest({ chain, address });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    const tokens = await getTokenData(chain, address);

    res.json({
      success: true,
      data: tokens
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/mcp/transactions/:chain/:address
 * Get transaction history for a specific chain and address
 */
router.get('/transactions/:chain/:address', async (req, res, next) => {
  try {
    const { chain, address } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Validate input
    const validation = validateMCPRequest({ chain, address });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    const transactions = await getTransactionHistory(chain, address, { limit, offset });

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/mcp/query
 * Execute a custom MCP query
 */
router.post('/query', async (req, res, next) => {
  try {
    const { chain, category, method, params } = req.body;

    // Validate input
    const validation = validateMCPRequest({ chain, category, method });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    // This would use the MCP client to execute the query
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        chain,
        category,
        method,
        params,
        result: 'Query executed successfully'
      }
    });

  } catch (error) {
    next(error);
  }
});

export { router as mcpRouter }; 