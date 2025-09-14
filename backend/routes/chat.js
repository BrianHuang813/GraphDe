// routes/chat.js
import express from "express";
import { processChatMessage } from "../services/chatService.js";
import { validateChatMessage } from "../utils/validation.js";


/**
 * POST /api/chat
 * Process a chat message and return AI response and chart data in json format to the frontend
 */
router.post("/", async (req, res, next) => {
  try {
    const { Inputmessage, sessionId } = req.body;

    // Validate input
    const validation = validateChatMessage({ Inputmessage, sessionId });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    // Process the chat message
    
    // return 
      // message: aiResponse,
      // chartData,
      // intent: intent.type,
      // timestamp: new Date().toISOString(),
      // sessionId
    
    const response = await processChatMessage( Inputmessage, sessionId );

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/chat/history/:sessionId
 * Get chat history for a session
 */
router.get("/history/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    // For now, return empty history
    // In a real app, you'd fetch from database
    res.json({
      success: true,
      data: {
        sessionId,
        messages: [],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/chat/history/:sessionId
 * Clear chat history for a session
 */
router.delete("/history/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    // For now, just return success
    // In a real app, you'd delete from database
    res.json({
      success: true,
      message: "Chat history cleared",
    });
  } catch (error) {
    next(error);
  }
});

export { router as chatRouter };
