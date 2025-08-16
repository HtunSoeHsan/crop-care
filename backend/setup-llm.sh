#!/bin/bash

# Ayar-Care LLM Setup Script
# This script sets up the local LLM environment for the plant disease chatbot

echo "🌱 Setting up Ayar-Care Local LLM Environment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Node.js and Python are installed"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create Python virtual environment
echo "🐍 Creating Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment and install Python dependencies
echo "🐍 Installing Python dependencies for LLM..."
source venv/bin/activate
pip install --upgrade pip

# Install required Python packages
pip install \
    langchain \
    langchain-community \
    sentence-transformers \
    torch \
    transformers \
    numpy \
    scikit-learn \
    faiss-cpu

echo "✅ Python dependencies installed"

# Install Ollama (if not already installed)
if ! command -v ollama &> /dev/null; then
    echo "📥 Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "✅ Ollama installed"
else
    echo "✅ Ollama is already installed"
fi

# Check if Ollama is running
if pgrep -x "ollama" > /dev/null; then
    echo "✅ Ollama is already running"
else
    echo "🚀 Starting Ollama service..."
    ollama serve &
    sleep 5
fi

# Pull Llama3 model
echo "🤖 Pulling Llama3 model (this may take a while)..."
ollama pull llama3:8b

echo "✅ Llama3 model downloaded"

# Create data directory
echo "📁 Creating data directory..."
mkdir -p data

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL=mongodb://localhost:27017/ayar-care

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Weather API
WEATHER_API_KEY=your-weather-api-key

# LLM Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b

# URLs
FRONTEND_URL=http://localhost:4000
PORT=5000
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Test the setup
echo "🧪 Testing LLM setup..."
node test-llm.js

if [ $? -eq 0 ]; then
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Activate Python virtual environment: source venv/bin/activate"
    echo "2. Start the backend: npm run dev"
    echo "3. Start the frontend: cd ../ayar-care-fe && npm run dev"
    echo "4. Access the chatbot at http://localhost:4000"
    echo ""
    echo "The chatbot is now ready to use with local LLM!"
else
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
fi 