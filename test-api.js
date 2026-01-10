// Simple test script to verify the backend API is working

async function testAPI() {
  console.log('Testing Helix Backend API...\n');

  try {
    
    console.log('Test 1: Health Check Endpoint');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('Health Check:', healthData);
    console.log('');

    
    console.log('Test 2: Chat Endpoint');
    const chatResponse = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, I have a headache',
        conversationHistory: []
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`HTTP error! status: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    console.log(' Chat Response:');
    console.log('   Response:', chatData.response.substring(0, 100) + '...');
    console.log('   Urgency:', chatData.urgency);
    console.log('   Timestamp:', chatData.timestamp);
    console.log('');

    console.log('All tests passed! The API is working correctly.');
    console.log('');
    console.log(' You can now use the chat interface at: http://localhost:8080');

  } catch (error) {
    console.error(' Test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure the backend is running: npm run backend');
    console.log('2. Check if port 3001 is available');
    console.log('3. Verify your .env file has GEMINI_API_KEY set');
  }
}

testAPI();
