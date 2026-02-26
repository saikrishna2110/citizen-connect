# CitizensConnect Backend API

A comprehensive REST API for the CitizensConnect platform built with Node.js, Express, and MongoDB. This backend provides authentication, issue management, and role-based access control for citizens, developers, and politicians.

## 🚀 Features

- **JWT Authentication** with secure password hashing
- **Role-based Access Control** (Citizen, Developer, Politician)
- **Issue Management** with full CRUD operations
- **Comments & Voting** system on issues
- **MongoDB Integration** with Mongoose ODM
- **Rate Limiting** and security middleware
- **Input Validation** with express-validator
- **CORS Support** for frontend integration

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/citizensconnect

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRE=30d

   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB:**
   - **Local MongoDB:** Make sure MongoDB is running on your system
   - **MongoDB Atlas:** Update `MONGO_URI` with your connection string

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen" // optional, defaults to "citizen"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Issue Management Endpoints

#### Create Issue (Citizens Only)
```http
POST /api/issues
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "category": "Infrastructure",
  "priority": "high",
  "location": "Main Street, City"
}
```

#### Get All Issues (Developers & Politicians Only)
```http
GET /api/issues
Authorization: Bearer <jwt_token>
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `category`: Filter by category
- `priority`: Filter by priority
- `status`: Filter by status
- `startDate`: Filter from date
- `endDate`: Filter to date
- `sort`: Sort by ('newest', 'oldest', 'priority', 'votes')

#### Get User's Own Issues
```http
GET /api/issues/my
Authorization: Bearer <jwt_token>
```

#### Get Single Issue
```http
GET /api/issues/:id
Authorization: Bearer <jwt_token>
```

#### Update Issue
```http
PUT /api/issues/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in-progress",
  "assignedTo": "user_id"
}
```

#### Delete Issue (Creator or Developers Only)
```http
DELETE /api/issues/:id
Authorization: Bearer <jwt_token>
```

#### Vote on Issue
```http
POST /api/issues/:id/vote
Authorization: Bearer <jwt_token>
```

#### Add Comment
```http
POST /api/issues/:id/comments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "This is a comment"
}
```

#### Delete Comment (Author or Developers Only)
```http
DELETE /api/issues/:id/comments/:commentId
Authorization: Bearer <jwt_token>
```

#### Get Issue Statistics
```http
GET /api/issues/stats
Authorization: Bearer <jwt_token>
```

## 👥 User Roles & Permissions

### Citizen
- ✅ Register/Login
- ✅ Create issues
- ✅ View own issues
- ✅ Comment on issues
- ✅ Vote on issues

### Developer
- ✅ All Citizen permissions
- ✅ View all issues
- ✅ Update any issue
- ✅ Delete any issue
- ✅ Delete any comment
- ✅ View issue statistics

### Politician
- ✅ All Citizen permissions
- ✅ View all issues
- ✅ Update issue status
- ✅ Assign issues to users
- ✅ View issue statistics

## 🔧 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── issueController.js   # Issue management logic
├── middleware/
│   └── auth.js              # JWT authentication & authorization
├── models/
│   ├── User.js              # User schema
│   └── Issue.js             # Issue schema
├── routes/
│   ├── auth.js              # Authentication routes
│   └── issues.js            # Issue routes
├── server.js                # Main application file
├── package.json             # Dependencies & scripts
├── env.example             # Environment variables template
└── README.md               # This file
```

## 🛡️ Security Features

- **Password Hashing** with bcrypt
- **JWT Tokens** with expiration
- **Rate Limiting** to prevent abuse
- **CORS Protection**
- **Helmet Security Headers**
- **Input Validation** and sanitization
- **SQL Injection Protection** (MongoDB/Mongoose)

## 🧪 Testing the API

### Using cURL Examples:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "citizen"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Create an issue (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Issue",
    "description": "This is a test issue",
    "category": "Other",
    "priority": "medium"
  }'
```

## 🚀 Production Deployment

1. **Set Environment Variables:**
   ```env
   NODE_ENV=production
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://yourdomain.com
   ```

2. **Build and Deploy:**
   ```bash
   npm start
   ```

3. **Use Process Manager:**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start server.js --name "citizensconnect-api"
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please create an issue in the repository or contact the development team.

---

**Happy Coding! 🎉**
