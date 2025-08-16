const { spawn } = require('child_process');

console.log('Testing Ollama integration...');

function testOllama() {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama3:8b', 'Say hello']);
    
    let response = '';
    let error = '';
    
    ollama.stdout.on('data', (data) => {
      response += data.toString();
      console.log('Received data:', data.toString());
    });
    
    ollama.stderr.on('data', (data) => {
      error += data.toString();
      console.log('Error:', data.toString());
    });
    
    ollama.on('close', (code) => {
      console.log('Process closed with code:', code);
      if (code === 0 && response.trim()) {
        console.log('Success! Response:', response.trim());
        resolve(response.trim());
      } else {
        console.log('Failed! Error:', error);
        reject(new Error(error || 'Failed to get response'));
      }
    });
    
    // Timeout after 60 seconds
    setTimeout(() => {
      console.log('Timeout reached, killing process...');
      ollama.kill();
      reject(new Error('Timeout'));
    }, 60000);
  });
}

testOllama()
  .then(result => {
    console.log('✅ Test passed:', result);
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ Test failed:', error.message);
    process.exit(1);
  }); 