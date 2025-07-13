import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Environment variables test:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('NODIT_API_KEY:', process.env.NODIT_API_KEY ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT || '3001 (default)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development (default)'); 