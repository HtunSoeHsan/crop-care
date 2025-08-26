# Ayar-Care API Integration Guide for Frontend

## Overview
This document provides comprehensive information about all available API endpoints and features in the Ayar-Care plant disease detection and prevention system.

**Base URL:** `${process.env.NEXT_PUBLIC_API_BASE}`
**Frontend URL:** `http://localhost:4000` (configurable via `FRONTEND_URL` env variable)

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
```http
POST /auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

### 2. User Login
```http
POST /auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** Same as registration

### 3. Google OAuth Login
```http
GET /auth/google
```
Redirects to Google OAuth consent screen.

**Callback:**
```http
GET /auth/google/callback
```
Handles Google OAuth callback and redirects to frontend with token in cookie.

### 4. Get User Profile (Protected)
```http
GET /auth/profile
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### 5. Update User Profile (Protected)
```http
PUT /auth/profile
```
**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

## 🔍 Plant Disease Detection Endpoints

### 1. Detect Plant Disease (Protected)
```http
POST /detections/detect
Content-Type: multipart/form-data
```
**Form Data:**
- `image`: Image file (JPEG, PNG, WebP, max 10MB)

**Response (with Multilingual Support):**
```json
{
  "status": "success",
  "data": [
    {
      "classIndex": 0,
      "name": {
        "en": "Apple Scab",
        "mm": "ပန်းသီး၏အရေပြားရောဂါ"
      },
      "description": {
        "en": "A fungal disease affecting apple trees...",
        "mm": "ပန်းသီးပင်များကို ထိခိုက်စေသော မှိုရောဂါ..."
      },
      "symptoms": [
        {
          "en": "Dark, scabby lesions on leaves",
          "mm": "အရွက်များတွင် မဲနက်သော အနာများ"
        },
        {
          "en": "Premature leaf drop",
          "mm": "အရွက်များ အချိန်မတန်မီ ကြွေကျခြင်း"
        },
        {
          "en": "Reduced fruit quality",
          "mm": "အသီး၏အရည်အသွေး ကျဆင်းခြင်း"
        }
      ],
      "plantType": {
        "en": "Apple",
        "mm": "ပန်းသီး"
      },
      "treatments": [
        {
          "en": "Apply fungicide spray",
          "mm": "မှိုသတ်ဆေး ဖြန်းပေးခြင်း"
        },
        {
          "en": "Remove infected leaves",
          "mm": "ပိုးဝင်နေသော အရွက်များ ဖယ်ရှားခြင်း"
        },
        {
          "en": "Improve air circulation",
          "mm": "လေဝင်လေထွက် ကောင်းအောင် လုပ်ခြင်း"
        }
      ],
      "detection": {
        "confidence": "85.42",
        "imageUrl": "",
        "detectedAt": "2023-01-01T00:00:00.000Z"
      }
    }
    // ... up to 5 top predictions
  ]
}
```

**Features:**
- ✅ Multi-model ensemble prediction
- ✅ Image augmentation for better accuracy
- ✅ Confidence scoring and filtering
- ✅ Comprehensive disease information
- ✅ Treatment recommendations
- ✅ Top 5 predictions with confidence levels

---

## 💬 Community Forum Endpoints

### 1. Get All Forum Posts
```http
GET /forum/posts
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "_id": "post_id",
        "title": "Help with tomato blight",
        "content": "My tomato plants are showing...",
        "userId": {
          "_id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2023-01-01T00:00:00.000Z",
        "replies": [
          {
            "_id": "reply_id",
            "content": "This looks like early blight...",
            "userId": {
              "name": "Expert Jane",
              "email": "jane@example.com"
            },
            "upvotes": 5,
            "downvotes": 0,
            "createdAt": "2023-01-01T01:00:00.000Z"
          }
        ]
      }
    ]
  }
}
```

### 2. Get Single Forum Post
```http
GET /forum/posts/:id
```

### 3. Create Forum Post (Protected)
```http
POST /forum/posts
```
**Request Body:**
```json
{
  "title": "Need help with plant disease",
  "content": "I noticed some spots on my plant leaves..."
}
```

### 4. Create Reply (Protected)
```http
POST /forum/posts/:id/replies
```
**Request Body:**
```json
{
  "content": "This looks like a fungal infection. Try..."
}
```

### 5. Vote on Reply (Protected)
```http
POST /forum/replies/:id/vote
```
**Request Body:**
```json
{
  "voteType": "up" // or "down"
}
```

---

## 🌦️ Weather Alert Endpoints

### 1. Get Weather Alerts (Protected)
```http
GET /weather/alerts?latitude=40.7128&longitude=-74.0060
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "weather": {
      "temperature": 25.5,
      "humidity": 85,
      "precipitation": 5.2
    },
    "alerts": [
      {
        "type": "HIGH_HUMIDITY",
        "severity": "warning",
        "message": "High humidity conditions detected. Increased risk of fungal diseases.",
        "recommendations": [
          "Ensure proper air circulation around plants",
          "Avoid overhead watering",
          "Consider applying preventive fungicide"
        ]
      }
    ]
  }
}
```

**Alert Types:**
- `HIGH_HUMIDITY` (>80%)
- `HIGH_TEMPERATURE` (>30°C)
- `HIGH_PRECIPITATION` (>10mm)

---

## 🛠️ Debug & Development Endpoints

### 1. Inspect Model (Protected)
```http
GET /debug/inspect-model
```
Returns detailed information about the ML model structure and capabilities.

### 2. Test Model Predictions (Protected)
```http
GET /debug/test-predictions
```
Runs model prediction tests (check server logs for results).

### 3. Get Disease Mappings (Protected)
```http
GET /debug/disease-mappings
```
Returns all available disease classes and their mappings.

---

## 📋 Additional Features Available

### 1. Enhanced Disease Detection System
- **Multi-model ensemble**: Uses multiple trained models for better accuracy
- **Image augmentation**: Applies various transformations for robust predictions
- **Confidence filtering**: Only shows predictions above certain confidence thresholds
- **Top-5 predictions**: Returns multiple possible diseases with confidence scores

### 2. Comprehensive Disease Information
Each detection includes:
- Disease name and description
- Plant type identification
- Symptom descriptions
- Treatment recommendations
- Confidence scores

### 3. Weather-based Alerts
- Real-time weather monitoring
- Disease risk assessment based on weather conditions
- Preventive care recommendations
- Location-based alerts

### 4. Community Features
- User forum for plant care discussions
- Expert replies and voting system
- Post categorization and tagging
- User profiles and authentication

### 5. Authentication Options
- Traditional email/password registration
- Google OAuth integration
- JWT-based session management
- Role-based access control

---

## 🔧 Environment Variables Required

Create a `.env` file in the backend root directory:

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

# Node Environment
NODE_ENV=development
```

---

## 🚀 Quick Start Integration Examples

### 1. Authentication Flow
```javascript
// Registration
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Login and store token
const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  if (data.status === 'success') {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};
```

### 2. Disease Detection
```javascript
// Upload and detect disease
const detectDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/detections/detect', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  return response.json();
};
```

### 3. Forum Integration
```javascript
// Get forum posts
const getForumPosts = async () => {
  const response = await fetch('/api/forum/posts');
  return response.json();
};

// Create new post
const createPost = async (postData) => {
  const response = await fetch('/api/forum/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(postData)
  });
  return response.json();
};
```

### 4. Weather Alerts
```javascript
// Get weather alerts for user's location
const getWeatherAlerts = async (latitude, longitude) => {
  const response = await fetch(
    `/api/weather/alerts?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.json();
};
```

---

## 📱 Frontend Integration Recommendations

### 1. State Management
Consider using React Context or Redux to manage:
- User authentication state
- Detection results
- Forum posts and replies
- Weather alerts

### 2. Image Handling
- Implement image preview before upload
- Show loading states during detection
- Handle large file size warnings
- Support drag-and-drop uploads

### 3. Responsive Design
- Mobile-first approach for field use
- Touch-friendly interfaces
- Offline capability considerations
- Progressive Web App (PWA) features

### 4. Real-time Features
Consider implementing:
- WebSocket connections for real-time forum updates
- Push notifications for weather alerts
- Background sync for detection history

### 5. Error Handling
Implement comprehensive error handling for:
- Network failures
- Authentication errors
- File upload failures
- Model prediction errors

---

## 🔄 Model Training and Updates

The system includes scripts for:
- **Dataset preparation**: `npm run prepare-dataset`
- **Model training**: `npm run train`
- **Database seeding**: `npm run seed`

These allow for continuous improvement of the disease detection accuracy.

---

## 📊 Analytics and Monitoring

Consider implementing:
- Detection accuracy tracking
- User engagement metrics
- Popular plant types and diseases
- Geographic usage patterns
- API performance monitoring

---

This integration guide provides all the necessary information to build a comprehensive plant disease detection and prevention application. The backend is designed to be scalable, secure, and feature-rich to support various frontend implementations.
