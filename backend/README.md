# Ayar-Care Backend - Plant Disease Detection and Prevention API

A comprehensive backend system for plant disease detection and prevention, featuring machine learning-based disease identification, community forums, weather alerts, and personal plant management.

## 🌟 Features Overview

### 🔍 Core Disease Detection
- **Multi-model ensemble prediction** for higher accuracy
- **Image augmentation** and preprocessing for robust analysis
- **Top-5 disease predictions** with confidence scores
- **Comprehensive disease information** including symptoms and treatments
- **38+ plant disease classes** supported
- **Treatment recommendations** based on detected diseases

### 🔐 Authentication & User Management
- **JWT-based authentication** with secure token management
- **Google OAuth integration** for easy sign-up/login
- **User profile management** with customizable preferences
- **Role-based access control** (user/expert/admin)
- **Session management** with configurable expiration

### 💬 Community Forum
- **Post creation and management** for plant care discussions
- **Threaded replies** with voting system
- **User profiles** with reputation tracking
- **Expert verification** and highlighted responses
- **Search and filtering** capabilities

### 🌦️ Weather Integration
- **Real-time weather monitoring** using external APIs
- **Disease risk assessment** based on weather conditions
- **Location-based alerts** for preventive care
- **Humidity, temperature, and precipitation tracking**
- **Customizable alert thresholds**

### 📚 Plant Care Guides
- **Comprehensive plant care information** for various species
- **Detailed care instructions** (watering, sunlight, soil, etc.)
- **Seasonal care recommendations**
- **Common disease prevention** tips
- **Difficulty ratings** for different experience levels
- **User ratings and reviews**
- **Search and filtering** by plant type, difficulty, tags

### 🪴 Personal Plant Collection
- **Individual plant tracking** with photos and notes
- **Care history logging** with activity tracking
- **Automated reminders** for watering, fertilizing, etc.
- **Health status monitoring** (healthy/sick/recovering)
- **Detection history integration**
- **Photo timeline** for growth tracking

### 🛠️ Developer Tools
- **Model inspection endpoints** for debugging
- **Disease mapping visualization**
- **Prediction testing utilities**
- **Performance monitoring**
- **API documentation** with examples

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB database
- Python 3.8+ (for ML model training)
- Weather API key (WeatherAPI or similar)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ayar-care-be
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env` file in the root directory:
```env
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

# URLs
FRONTEND_URL=http://localhost:4000
PORT=5000

# Environment
NODE_ENV=development
```

4. **Build the application:**
```bash
npm run build
```

5. **Seed the database (optional):**
```bash
npm run seed
```

6. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📖 API Documentation

Comprehensive API documentation is available in [`API_INTEGRATION_GUIDE.md`](./API_INTEGRATION_GUIDE.md)

### Quick API Overview

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Disease Detection
- `POST /api/detections/detect` - Detect plant diseases from images

#### Community Forum
- `GET /api/forum/posts` - Get all forum posts
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/replies` - Add reply
- `POST /api/forum/replies/:id/vote` - Vote on reply

#### Weather Alerts
- `GET /api/weather/alerts` - Get weather-based disease alerts

#### Plant Care Guides
- `GET /api/plant-care/guides` - Get all plant care guides
- `GET /api/plant-care/guides/featured` - Get featured guides
- `GET /api/plant-care/guides/search` - Search guides
- `POST /api/plant-care/guides` - Create new guide
- `POST /api/plant-care/guides/:id/rate` - Rate a guide

#### Personal Plant Collection
- `GET /api/plant-collection/plants` - Get user's plants
- `POST /api/plant-collection/plants` - Add plant to collection
- `POST /api/plant-collection/plants/:id/care` - Log care activity
- `GET /api/plant-collection/reminders/upcoming` - Get upcoming reminders

#### Debug & Development
- `GET /api/debug/inspect-model` - Inspect ML model
- `GET /api/debug/disease-mappings` - View disease mappings
- `GET /api/debug/test-predictions` - Test model predictions

## 🤖 Machine Learning Model

### Model Training
The system includes scripts for training custom plant disease detection models:

1. **Prepare dataset:**
```bash
npm run prepare-dataset
```

2. **Train model:**
```bash
npm run train
```

### Model Features
- **TensorFlow.js integration** for browser and Node.js compatibility
- **Transfer learning** using pre-trained networks
- **Data augmentation** for improved generalization
- **Ensemble predictions** for higher accuracy
- **Real-time inference** with optimized performance

## 🏗️ Architecture

### Technology Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose ODM
- **ML Framework:** TensorFlow.js
- **Authentication:** JWT, Passport.js, Google OAuth
- **Image Processing:** Sharp, Multer
- **Weather API:** WeatherAPI integration

### Project Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Authentication & validation
├── models/         # Database schemas (MongoDB)
├── routes/         # API route definitions
├── services/       # Business logic
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── scripts/        # ML training & data scripts
```

## 🔧 Configuration

### Environment Variables
All configuration is handled through environment variables. See `.env.example` for the complete list.

### Database Setup
Refer to `MONGODB_SETUP.md` for detailed database configuration instructions.

## 🚢 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Support
```bash
# Build image
docker build -t ayar-care-api .

# Run container
docker run -p 5000:5000 --env-file .env ayar-care-api
```

### Environment-Specific Configuration
- **Development:** Full debugging, detailed error messages
- **Production:** Optimized performance, error logging, security headers

## 📊 Monitoring & Analytics

### Available Metrics
- API request/response times
- Disease detection accuracy
- User engagement metrics
- Model performance statistics
- Error rates and debugging info

### Health Checks
- `/api/health` - Basic health status
- `/api/debug/inspect-model` - ML model status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update API documentation
- Ensure backwards compatibility

## 📝 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Integration tests
npm run test:integration
```

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Errors:**
   - Ensure model files exist in `models/` directory
   - Check file permissions and paths
   - Verify TensorFlow.js version compatibility

2. **Database Connection:**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure database exists and user has permissions

3. **Image Upload Issues:**
   - Check file size limits (10MB default)
   - Verify supported formats (JPEG, PNG, WebP)
   - Ensure upload directory has write permissions

4. **Weather API:**
   - Verify API key is valid
   - Check rate limiting
   - Ensure internet connectivity

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and debugging information.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- TensorFlow.js team for the ML framework
- PlantNet for disease classification inspiration
- Weather API providers for real-time data
- Open source plant disease datasets

---

**For complete API integration details, see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)**

**For frontend integration examples and best practices, check the documentation in the guide.**

*Built with ❤️ for sustainable agriculture and plant health*

# Plant Disease Detection and Prevention API

A Node.js-based RESTful API for plant disease detection and prevention using machine learning, weather data, and community features.

## Features

- User authentication and profile management
- Plant disease detection using TensorFlow.js
- Weather-based disease alerts
- Community forum for discussions
- Treatment recommendations
- Detection history tracking

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- TensorFlow.js model for plant disease detection

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd plant-disease-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/plant_disease_db"
PORT=3000
JWT_SECRET="your-super-secret-jwt-key"
MODEL_PATH="./models/plant_disease_model"
WEATHER_API_KEY="your-weather-api-key"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Disease Detection
- `POST /api/detections/detect` - Upload image for disease detection
- `GET /api/detections/history` - Get detection history

### Forum
- `GET /api/forum/posts` - Get all forum posts
- `GET /api/forum/posts/:id` - Get specific post
- `POST /api/forum/posts` - Create new post
- `POST /api/forum/posts/:id/replies` - Add reply to post
- `POST /api/forum/replies/:id/vote` - Vote on reply

### Weather Alerts
- `GET /api/weather/alerts` - Get weather-based disease alerts

## Model Training

The API uses a pre-trained TensorFlow.js model for plant disease detection. To train your own model:

1. Prepare your dataset of plant disease images
2. Use TensorFlow.js to train a model
3. Save the model in the specified `MODEL_PATH`
4. Update the model configuration in the detection service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 