#!/usr/bin/env node

/**
 * Test script for LLM setup
 * This script tests the basic functionality of the LLM service
 */

const { spawn } = require('child_process');

console.log('🧪 Testing LLM Setup...\n');

// Test 1: Check if Ollama is installed
console.log('1. Checking Ollama installation...');
const ollamaCheck = spawn('ollama', ['--version']);

ollamaCheck.stdout.on('data', (data) => {
  console.log('✅ Ollama is installed:', data.toString().trim());
});

ollamaCheck.stderr.on('data', (data) => {
  console.log('❌ Ollama not found:', data.toString());
  process.exit(1);
});

ollamaCheck.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Ollama check passed\n');
    testModelAvailability();
  } else {
    console.log('❌ Ollama check failed\n');
    process.exit(1);
  }
});

// Test 2: Check if Llama3 model is available
function testModelAvailability() {
  console.log('2. Checking Llama3 model availability...');
  const modelCheck = spawn('ollama', ['list']);

  modelCheck.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('llama3')) {
      console.log('✅ Llama3 model is available');
      console.log('📋 Available models:');
      console.log(output);
      console.log('✅ Model check passed\n');
      testBasicInference();
    } else {
      console.log('❌ Llama3 model not found');
      console.log('📋 Available models:');
      console.log(output);
      console.log('💡 Run: ollama pull llama3:8b');
      process.exit(1);
    }
  });

  modelCheck.stderr.on('data', (data) => {
    console.log('❌ Error checking models:', data.toString());
    process.exit(1);
  });
}

// Test 3: Test basic inference
function testBasicInference() {
  console.log('3. Testing basic inference...');
  const testPrompt = 'Hello, are you working? Please respond with "Yes, I am working correctly."';
  
  const inference = spawn('ollama', ['run', 'llama3:8b', testPrompt]);
  
  let response = '';
  let hasResponse = false;
  
  inference.stdout.on('data', (data) => {
    response += data.toString();
    hasResponse = true;
  });

  inference.stderr.on('data', (data) => {
    console.log('⚠️  Warning:', data.toString());
  });

  inference.on('close', (code) => {
    if (code === 0 && hasResponse) {
      console.log('✅ Basic inference test passed');
      console.log('📝 Response received:', response.trim().substring(0, 100) + '...');
      console.log('\n🎉 All tests passed! LLM setup is working correctly.');
      console.log('\nNext steps:');
      console.log('1. Start the backend: npm run dev');
      console.log('2. Start the frontend: cd ../ayar-care-fe && npm run dev');
      console.log('3. Test the chatbot at http://localhost:4000');
    } else {
      console.log('❌ Basic inference test failed');
      console.log('Response:', response);
      process.exit(1);
    }
  });

  // Timeout after 30 seconds
  setTimeout(() => {
    if (!hasResponse) {
      console.log('❌ Inference test timed out');
      process.exit(1);
    }
  }, 30000);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted');
  process.exit(0);
}); 