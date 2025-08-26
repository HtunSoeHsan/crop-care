# 🤖 Ayar-Care Plant Disease Chatbot

A sophisticated AI-powered chatbot for plant disease diagnosis and care advice, built with local LLM (Llama3), RAG (Retrieval-Augmented Generation), and sentence transformers.

## 🌟 Features

### **Local LLM Integration**
- **Llama3 8B** model via Ollama for privacy and offline operation
- **No external API dependencies** - everything runs locally
- **Customizable model parameters** for optimal performance
- **Real-time response generation** with context awareness

### **RAG (Retrieval-Augmented Generation)**
- **Sentence Transformers** for semantic search
- **Plant disease knowledge base** with 38+ disease types
- **Contextual responses** based on relevant information
- **Confidence scoring** for response accuracy

### **Plant Disease Specialization**
- **Expert knowledge** in plant pathology
- **Symptom identification** and diagnosis
- **Treatment recommendations** (organic and chemical)
- **Prevention strategies** and best practices
- **Plant care guidance** and maintenance tips

### **Smart Context Integration**
- **Scan results integration** - chatbot aware of detected diseases
- **Weather context** - considers environmental factors
- **Plant type awareness** - species-specific advice
- **Conversation history** - maintains context across interactions

### **User Experience**
- **Real-time status indicators** (AI Ready/Loading/Offline)
- **Smart suggestions** based on conversation context
- **Fallback responses** when LLM is unavailable
- **Multilingual support** (English & Malay)
- **Responsive design** with modern UI

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Local LLM     │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (Ollama)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chat UI       │    │   LLM Service   │    │   Llama3 8B     │
│   Components    │    │   RAG Engine    │    │   Model         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Service   │    │   Vector Store  │    │   Knowledge     │
│   Integration   │    │   (FAISS)       │    │   Base          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** and npm/yarn
- **Python 3.8+** and pip
- **MongoDB** database
- **8GB+ RAM** (for Llama3 model)
- **Linux/macOS** (Ollama support)

### Installation

1. **Clone and navigate to backend:**
```bash
cd ayar-care-be
```

2. **Run the automated setup script:**
```bash
npm run setup-llm
```

This script will:
- Install Node.js dependencies
- Install Python dependencies for LLM
- Install and configure Ollama
- Download Llama3 8B model
- Create necessary directories and config files
- Test the LLM setup

3. **Start the backend:**
```bash
npm run dev
```

4. **Start the frontend (in another terminal):**
```bash
cd ../ayar-care-fe
npm run dev
```

5. **Access the chatbot:**
- Open http://localhost:4000
- Look for the chat icon in the bottom-right corner
- Start asking plant disease questions!

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file:

```env
# LLM Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b

# Other existing variables...
DATABASE_URL=mongodb://localhost:27017/ayar-care
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:4000
PORT=5000
```

### Model Configuration

You can customize the LLM behavior by modifying `src/services/llm.service.ts`:

```typescript
this.llm = new Ollama({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3:8b',
  temperature: 0.7,        // Creativity (0.0-1.0)
  maxTokens: 2048,         // Response length
});
```

## 📚 Knowledge Base

The chatbot uses a comprehensive plant disease knowledge base:

### Default Diseases Included
- **Powdery Mildew** - Fungal disease with white powdery spots
- **Leaf Spot Disease** - Bacterial/fungal spots with yellow halos
- **Root Rot** - Serious condition from overwatering
- **Blight** - Devastating fungal disease

### Adding New Knowledge

You can add new diseases to the knowledge base:

```typescript
// Via API (requires authentication)
POST /api/chatbot/knowledge
{
  "disease": "New Disease Name",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "causes": ["Cause 1", "Cause 2"],
  "treatments": ["Treatment 1", "Treatment 2"],
  "prevention": ["Prevention 1", "Prevention 2"],
  "plantTypes": ["plant1", "plant2"],
  "severity": "medium",
  "content": "Detailed description..."
}
```

## 🔌 API Endpoints

### Public Endpoints
```http
POST /api/chatbot/chat
GET  /api/chatbot/health
```

### Protected Endpoints (requires authentication)
```http
GET    /api/chatbot/history
DELETE /api/chatbot/history
POST   /api/chatbot/knowledge
```

### Example Usage

```typescript
// Send a chat message
const response = await fetch('/api/chatbot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "My tomato plant has yellow leaves with brown spots",
    context: {
      plantType: "tomato",
      scanResults: { /* scan data */ }
    }
  })
});

// Response format
{
  "success": true,
  "data": {
    "answer": "Based on your description, this sounds like...",
    "sources": ["Leaf Spot Disease", "Early Blight"],
    "confidence": 0.85,
    "suggestions": [
      "What are the treatment options?",
      "How can I prevent this?"
    ]
  }
}
```

## 🧪 Testing

### Health Check
```bash
curl ${process.env.NEXT_PUBLIC_API_BASE}/chatbot/health
```

### Test Chat
```bash
curl -X POST ${process.env.NEXT_PUBLIC_API_BASE}/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the symptoms of powdery mildew?"}'
```

## 🔍 Troubleshooting

### Common Issues

1. **Ollama not starting:**
```bash
# Check if Ollama is running
ollama list

# Start Ollama manually
ollama serve
```

2. **Model not found:**
```bash
# Pull the model again
ollama pull llama3:8b
```

3. **Memory issues:**
```bash
# Use a smaller model
export OLLAMA_MODEL=llama3:3b
```

4. **Python dependencies:**
```bash
# Reinstall Python packages
pip3 install -r requirements.txt
```

### Performance Optimization

1. **Reduce model size** for lower memory usage
2. **Adjust temperature** for more focused responses
3. **Limit conversation history** to prevent memory bloat
4. **Use GPU acceleration** if available

## 🔒 Security & Privacy

### Local Processing
- **No data sent to external APIs**
- **All conversations stay on your server**
- **No internet dependency** for core functionality

### Authentication
- **JWT-based authentication** for protected endpoints
- **Session management** for user context
- **Role-based access** for knowledge management

## 📈 Monitoring

### Health Metrics
- **LLM service status** (ready/loading/error)
- **Response confidence scores**
- **Knowledge base size**
- **Conversation history length**

### Logs
```bash
# Backend logs
npm run dev

# Ollama logs
ollama serve --verbose
```

## 🤝 Contributing

### Adding New Features
1. **Extend the knowledge base** with new diseases
2. **Improve RAG retrieval** with better embeddings
3. **Add new conversation flows** for specific scenarios
4. **Enhance UI components** for better UX

### Code Structure
```
src/
├── services/
│   └── llm.service.ts          # LLM and RAG logic
├── controllers/
│   └── chatbot.controller.ts   # API endpoints
├── routes/
│   └── chatbot.routes.ts       # Route definitions
└── data/
    └── plant-disease-knowledge.json  # Knowledge base
```

## 📄 License

This chatbot feature is part of the Ayar-Care project and follows the same license terms.

## 🆘 Support

For issues related to the chatbot:
1. Check the troubleshooting section
2. Review the logs for error messages
3. Test the LLM health endpoint
4. Ensure all dependencies are properly installed

---

**🌱 Happy Plant Care with AI! 🌱** 