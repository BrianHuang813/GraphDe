import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { processChatMessage } from './services/chatService.js';
import { extractIntent } from './utils/intentExtractor.js';

// Load environment variables
dotenv.config();

console.log('🔍 GraphDe Backend API Test Suite');
console.log('=====================================\n');

// Test 1: Environment Variables
console.log('1. Testing Environment Variables...');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('   NODIT_API_KEY:', process.env.NODIT_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('   PORT:', process.env.PORT || '3001 (default)');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development (default)');
console.log('   API KEY VALUE:', process.env.GEMINI_API_KEY);
console.log('');

// Test 2: Gemini API Connection
async function testGeminiConnection() {
  console.log('2. Testing Gemini API Connection...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('   ❌ GEMINI_API_KEY not found. Skipping Gemini tests.');
    return false;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = "Hello! Please respond with 'Gemini connection successful!'";
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;
    
    console.log('   ✅ Gemini API connection successful!');
    console.log('   Response:', text);
    return true;
  } catch (error) {
    console.log('   ❌ Gemini API connection failed:');
    console.log('   Error:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

// Test 3: Intent Extraction
async function testIntentExtraction() {
  console.log('\n3. Testing Intent Extraction...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('   ❌ GEMINI_API_KEY not found. Skipping intent extraction tests.');
    return false;
  }

  try {
    const testMessage = "Show me the balance of 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 on Ethereum";
    console.log('   Testing message:', testMessage);
    
    const intent = await extractIntent(testMessage);
    console.log('   ✅ Intent extraction successful!');
    console.log('   Extracted intent:', JSON.stringify(intent, null, 2));
    return true;
  } catch (error) {
    console.log('   ❌ Intent extraction failed:');
    console.log('   Error:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

// Test 4: Chat Message Processing
async function testChatProcessing() {
  console.log('\n4. Testing Chat Message Processing...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('   ❌ GEMINI_API_KEY not found. Skipping chat processing tests.');
    return false;
  }

  try {
    const testMessage = "What is blockchain technology?";
    const sessionId = "test-session-123";
    
    console.log('   Testing message:', testMessage);
    console.log('   Session ID:', sessionId);
    
    const response = await processChatMessage(testMessage, sessionId);
    console.log('   ✅ Chat processing successful!');
    console.log('   Response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.log('   ❌ Chat processing failed:');
    console.log('   Error:', error.message);
    console.log('   Stack:', error.stack);
    return false;
  }
}

// Test 5: Error Handling
async function testErrorHandling() {
  console.log('\n5. Testing Error Handling...');
  
  try {
    // Test with invalid API key

    const ai = new GoogleGenAI({ apiKey: 'invalid-key' });
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "test'",
    });
    
    console.log('   ❌ Should have failed with invalid key');
  } catch (error) {
    console.log('   ✅ Error handling works correctly');
    console.log('   Expected error:', error.message);
  }
}

// Test 6: Performance Test
async function testPerformance() {
  console.log('\n6. Testing Performance...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('   ❌ GEMINI_API_KEY not found. Skipping performance tests.');
    return;
  }

  try {
    const startTime = Date.now();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Quick test",
    });
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    console.log(`   ✅ API call completed in ${duration}ms`);
    
    if (duration > 10000) {
      console.log('   ⚠️  Response time is slow (>10s)');
    } else if (duration > 5000) {
      console.log('   ⚠️  Response time is moderate (>5s)');
    } else {
      console.log('   ✅ Response time is good (<5s)');
    }
  } catch (error) {
    console.log('   ❌ Performance test failed:', error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting comprehensive API tests...\n');
  
  const results = {
    gemini: await testGeminiConnection(),
    intent: await testIntentExtraction(),
    chat: await testChatProcessing(),
    errors: await testErrorHandling()
  };
  
  await testPerformance();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log('Gemini Connection:', results.gemini ? '✅ PASS' : '❌ FAIL');
  console.log('Intent Extraction:', results.intent ? '✅ PASS' : '❌ FAIL');
  console.log('Chat Processing:', results.chat ? '✅ PASS' : '❌ FAIL');
  console.log('Error Handling:', results.errors ? '✅ PASS' : '❌ FAIL');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Backend is ready for production.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. If tests failed, check your GEMINI_API_KEY');
  console.log('2. Run: npm start (for production)');
  console.log('3. Run: npm run dev (for development)');
}

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test suite failed with error:', error);
  process.exit(1);
}); 