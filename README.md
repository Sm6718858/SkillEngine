# 🚀 SkillEngine

> **A Modern Full-Stack Learning Platform for Competitive Programming & Placement Preparation**

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Active-brightgreen)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Features Detail](#features-detail)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**SkillEngine** is a comprehensive learning platform designed to help students master competitive programming, data structures, and prepare for placement interviews. It combines interactive coding challenges, structured courses, peer collaboration, and AI-powered assistance to create an engaging learning experience.

### Why SkillEngine?
- ✨ **Interactive Learning**: Real-time code execution with instant feedback
- 🤖 **AI-Powered**: AI chat assistant for problem guidance
- 👥 **Collaborative**: Group study rooms and peer interaction
- 📊 **Progress Tracking**: Detailed analytics and performance metrics
- 🎓 **Structured Courses**: Well-organized curriculum with lectures and quizzes
- 💰 **Course Marketplace**: Purchase and access premium courses

---

## ✨ Key Features

### 1. **Coding Challenge Platform**
- Solve hundreds of DSA and competitive programming problems
- Multiple language support (JavaScript, Python, C++, Java)
- Real-time code compilation and execution via Piston API
- Visible and hidden test cases for comprehensive evaluation
- Detailed result breakdown (passed/failed test cases)

### 2. **Structured Learning Paths**
- Self-paced video courses
- Lecture-based learning modules
- Progress tracking per course
- Certificate of completion

### 3. **Placement Preparation**
- Dedicated aptitude section
- Interview preparation modules
- Company-specific question banks
- Mock interviews and practice tests

### 4. **AI Assistant**
- Personalized coding help
- Problem-solving hints and guidance
- Real-time chat support
- Context-aware suggestions

### 5. **Collaborative Learning**
- Group study rooms
- Code sharing and discussion
- Peer review capabilities
- Discussion forums

### 6. **User Progress Dashboard**
- Course completion stats
- Problem-solving statistics
- Performance analytics
- Achievement badges

### 7. **Submission Management**
- Code submission history
- Result tracking
- Performance metrics
- Leaderboards

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching & caching
- **Monaco Editor** - Advanced code editor
- **Axios** - HTTP client

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Media storage & upload

### **External APIs**
- **Piston API** - Code execution & compilation
- **Cloudinary API** - Image/file management

### **DevTools**
- **ESLint** - Code linting
- **Vercel** - Frontend deployment

---

## 📁 Project Structure

```
SkillEngine/
├── Client/                          # React Frontend
│   ├── src/
│   │   ├── app/                    # Redux store & slices
│   │   ├── components/             # Reusable UI components
│   │   ├── features/               # Feature-specific API slices
│   │   ├── pages/                  # Page components
│   │   │   ├── Placement/         # Placement preparation pages
│   │   │   ├── Courses/           # Course learning pages
│   │   │   └── ...
│   │   ├── Layout/                # Layout components
│   │   ├── lib/                   # Utilities & helpers
│   │   ├── assets/                # Static assets
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── package.json
│   └── README.md
│
├── Server/                          # Node.js Backend
│   ├── Controller/                 # Route controllers
│   │   ├── aiChatController.js
│   │   ├── courseController.js
│   │   ├── courseProgressController.js
│   │   ├── problemsController.js
│   │   ├── submissionController.js
│   │   └── userController.js
│   ├── Models/                     # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── courseModel.js
│   │   ├── problemModel.js
│   │   └── ...
│   ├── Routes/                     # API routes
│   │   ├── courseRoute.js
│   │   ├── submissionRoutes.js
│   │   ├── userRoute.js
│   │   └── ...
│   ├── Middleware/                 # Authentication & validation
│   │   └── isAuthenticated.js
│   ├── Database/                   # DB connection
│   │   └── db.js
│   ├── Utils/                      # Utility functions
│   │   ├── cloudinary.js
│   │   └── ...
│   ├── uploads/                    # Local file uploads
│   ├── scripts/                    # Database scripts
│   │   └── seedProblems.js
│   ├── index.js                    # Server entry point
│   ├── package.json
│   └── README.md
│
├── package.json                     # Root package.json
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Cloudinary Account** (for media management)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/skillengine.git
cd skillengine
```

### Step 2: Install Backend Dependencies
```bash
cd Server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../Client
npm install
```

### Step 4: Configure Environment Variables

**Server** - Create `.env` file in `Server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillengine
# or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillengine

JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client** - Create `.env` file in `Client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd Server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🎮 Getting Started

### 1. **User Registration & Authentication**
- Sign up with email and password
- Email verification (optional)
- JWT-based session management

### 2. **Explore Problems**
- Navigate to "Coding Round"
- Browse problems by difficulty
- Select a problem and read the description
- View test cases and examples

### 3. **Solve Problems**
- Choose your preferred programming language
- Write or modify code in the editor
- Test with visible test cases
- Submit solution for evaluation

### 4. **Enroll in Courses**
- Browse available courses
- Purchase course access
- Track learning progress
- Complete lectures and assignments

### 5. **Use AI Assistant**
- Ask coding questions
- Get hints and explanations
- Discuss problem-solving approaches

### 6. **Join Study Groups**
- Create or join study rooms
- Collaborate with peers
- Share code and discuss solutions

---

## 📡 API Documentation

### **Authentication Endpoints**
```
POST   /api/user/register       - Register new user
POST   /api/user/login          - User login
POST   /api/user/logout         - User logout
GET    /api/user/profile        - Get user profile
PUT    /api/user/profile        - Update user profile
```

### **Problem/Coding Endpoints**
```
GET    /api/coding/getProblems       - Get all problems
GET    /api/coding/problems/:id      - Get single problem
POST   /api/coding/submit            - Submit solution
GET    /api/coding/submissions       - Get user submissions
```

### **Course Endpoints**
```
GET    /api/courses              - Get all courses
GET    /api/courses/:id          - Get course details
POST   /api/courses              - Create course (admin)
GET    /api/courses/:id/lectures - Get course lectures
```

### **Course Progress Endpoints**
```
GET    /api/progress              - Get user progress
POST   /api/progress/enroll       - Enroll in course
PUT    /api/progress/:id          - Update progress
```

### **Purchase Endpoints**
```
POST   /api/purchase              - Purchase course
GET    /api/purchase/history      - Get purchase history
```

### **AI Chat Endpoints**
```
POST   /api/chat/message          - Send message to AI
GET    /api/chat/history          - Get chat history
```

---

## 🎓 Features Detail

### **Submission Evaluation**
The system evaluates submissions by:
1. Injecting user code into boilerplate
2. Running against all test cases (visible + hidden)
3. Comparing actual vs expected output
4. Providing detailed feedback

Supported languages:
- JavaScript
- Python 3
- C++
- Java
- C

### **Course Management**
- Video lectures with timestamps
- Progress persistence
- Completion tracking
- Certificate generation

### **User Progress Tracking**
- Problems solved count
- Accuracy percentage
- Time spent on platform
- Difficulty distribution
- Streak counter

---

## 💾 Database Schema

### **User Model**
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  profilePhoto: String (Cloudinary URL),
  bio: String,
  joinedAt: Date,
  problemsSolved: Number,
  courseEnrolled: [ObjectId],
  ...
}
```

### **Problem Model**
```javascript
{
  id: String (unique),
  title: String,
  description: String,
  difficulty: String (Easy/Medium/Hard),
  tags: [String],
  boilerplate: { cpp, javascript, python },
  testcases: [{ input, output }],
  hiddenTestcases: [{ input, output }],
  ...
}
```

### **Course Model**
```javascript
{
  title: String,
  description: String,
  price: Number,
  instructor: ObjectId,
  lectures: [ObjectId],
  students: [ObjectId],
  rating: Number,
  ...
}
```

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/skillengine` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `CLOUDINARY_NAME` | Cloudinary account | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use meaningful variable and function names
- Write comments for complex logic
- Follow existing code style
- Test your changes before submitting PR

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support & Contact

- **Issues**: Report bugs via GitHub Issues
- **Email**: support@skillengine.com
- **Documentation**: [Full Docs](./docs)

---

## 🎉 Acknowledgments

- **Piston API** for code execution
- **Cloudinary** for media management
- **React** and **Express** communities
- All contributors and users

---

<div align="center">

**Made with ❤️ for aspiring developers**

⭐ If you find this helpful, please star the repository!

</div>

---

*Last Updated: December 2025*
