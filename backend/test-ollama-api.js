const axios = require('axios');

console.log('Testing Ollama API integration...');

async function testOllamaAPI() {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3:8b',
      prompt: 'What are the symptoms of powdery mildew?',
      stream: false
    }, {
      timeout: 120000
    });
    
    console.log('✅ API call successful');
    console.log('Response:', response.data.response);
    return response.data.response;
  } catch (error) {
    console.log('❌ API call failed:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
    }
    throw error;
  }
}

testOllamaAPI()
  .then(result => {
    console.log('✅ Test passed');
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ Test failed');
    process.exit(1);
  }); 