
const testMessage = async () => {
  try {
    console.log(' Testing backend API...\n');
    
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'I have a headache',
        conversationHistory: []
      }),
    });

    const data = await response.json();
    
    console.log(' API Response received!');
    console.log(' Response:', data.response);
    console.log(' Urgency:', data.urgency);
    console.log(' Timestamp:', data.timestamp);
    console.log(' Fallback used:', data.fallback ? 'Yes' : 'No');
    
  } catch (error) {
    console.error(' Error:', error.message);
  }
};

testMessage();
