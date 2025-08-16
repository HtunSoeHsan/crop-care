# MongoDB Setup Guide for Ayar Care Backend

This guide explains how to set up and run the Ayar Care backend with MongoDB instead of Prisma/PostgreSQL.

## Prerequisites

1. **Node.js** (v18+ recommended)
2. **MongoDB** (v4.4+ recommended)

## MongoDB Installation

### Option 1: Install MongoDB Community Edition locally

#### On Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

#### On macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### On Ubuntu/Linux:
```bash
# Import the MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: Use MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update your `.env` file with the Atlas connection string

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/ayar-care

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ayar-care?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-here
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### 3. Database Seeding

Seed the database with initial data:
```bash
npm run seed
```

This will create:
- Plant disease records with symptoms and descriptions
- Treatment recommendations (organic, chemical, preventive)
- Proper indexes for optimal query performance

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

## Database Schema

The MongoDB database uses the following collections:

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  password: String (hashed),
  role: String (USER|EXPERT|ADMIN),
  createdAt: Date,
  updatedAt: Date
}
```

### PlantDiseases
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  symptoms: [String],
  plantType: String,
  classIndex: Number (unique, for ML model mapping),
  createdAt: Date,
  updatedAt: Date
}
```

### Treatments
```javascript
{
  _id: ObjectId,
  diseaseId: ObjectId (ref: PlantDisease),
  name: String,
  description: String,
  steps: [String],
  type: String (ORGANIC|CHEMICAL|PREVENTIVE),
  createdAt: Date,
  updatedAt: Date
}
```

### Detections
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  diseaseId: ObjectId (ref: PlantDisease),
  imageUrl: String,
  confidence: Number (0-1),
  createdAt: Date,
  updatedAt: Date
}
```

### ForumPosts & ForumReplies
```javascript
// ForumPost
{
  _id: ObjectId,
  title: String,
  content: String,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}

// ForumReply
{
  _id: ObjectId,
  content: String,
  userId: ObjectId (ref: User),
  postId: ObjectId (ref: ForumPost),
  upvotes: Number,
  downvotes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

The following endpoints are available:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/google` - Google OAuth login

### Disease Detection
- `POST /api/detections/enhanced` - Enhanced disease detection with top 5 results

### Forum
- `GET /api/forum/posts` - Get all forum posts
- `POST /api/forum/posts` - Create new post
- `GET /api/forum/posts/:id` - Get specific post with replies
- `POST /api/forum/posts/:id/replies` - Add reply to post
- `PUT /api/forum/replies/:id/vote` - Vote on reply

### Weather
- `GET /api/weather/:location` - Get weather information

## Migration from Prisma

The following changes were made during the migration:

1. **Dependencies**: Removed `@prisma/client` and `prisma`, added `mongoose`
2. **Database Connection**: Replaced Prisma client with Mongoose connection
3. **Models**: Converted Prisma schema to Mongoose models with proper TypeScript interfaces
4. **Controllers**: Updated all database queries from Prisma syntax to Mongoose
5. **IDs**: Changed from UUID to MongoDB ObjectId format
6. **Relationships**: Implemented using Mongoose populate instead of Prisma includes

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Make sure MongoDB is running
   - Check if the connection string is correct

2. **Authentication Failed**
   ```
   Error: Authentication failed
   ```
   - Verify MongoDB username/password in connection string
   - Check if the database user has proper permissions

3. **Seeding Fails**
   ```
   Error: E11000 duplicate key error
   ```
   - Drop the database and run seed again
   - Or clear specific collections manually

### Useful MongoDB Commands

```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use specific database
use ayar-care

# Show collections
show collections

# Count documents in collection
db.plantdiseases.countDocuments()

# Find all documents in collection
db.users.find()

# Drop database (be careful!)
db.dropDatabase()
```

## Performance Considerations

The MongoDB setup includes:
- Proper indexes on frequently queried fields
- Aggregation pipeline for complex queries
- Connection pooling for better performance
- Graceful shutdown handling

## Backup and Recovery

For production environments:
1. Set up regular backups using `mongodump`
2. Consider replica sets for high availability
3. Monitor database performance and logs
4. Implement proper security measures

## Security Best Practices

1. Use strong passwords and enable authentication
2. Configure MongoDB to bind only to necessary interfaces
3. Enable TLS/SSL for production
4. Regular security updates
5. Implement role-based access control
6. Monitor database access logs
