# 🧠 Smart Knowledge Brain App

> Transform your thoughts into a connected knowledge universe. Save, organize, and discover insights with AI-powered intelligence.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Folder Structure](#-folder-structure)
- [Environment Setup](#-environment-setup)
- [Screenshots](#-screenshots)
- [API Endpoints](#-api-endpoints)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Smart Knowledge Brain App** is a full-stack web application that serves as your personal knowledge management system. Think of it as a "second brain" where you can save notes, bookmarks, and ideas. Powered by advanced AI and graph visualization, it helps you discover connections between your knowledge, retrieve relevant information instantly, and build a comprehensive knowledge base.

Whether you're a student, researcher, or lifelong learner, this app transforms scattered information into organized, interconnected wisdom.

---

## ✨ Key Features

- 📌 **Save & Manage Notes & Bookmarks** - Create, edit, and organize your thoughts with intuitive interfaces
- 🤖 **AI-Powered Chat Assistant** - Get intelligent responses based on your knowledge base using RAG (Retrieval Augmented Generation)
- 🕸️ **Knowledge Graph Visualization** - See the connections between your notes visually with interactive graph views
- 🔍 **Smart Search & Retrieval** - Advanced semantic search to find relevant information instantly
- 🏷️ **Auto-Generated Tags** - AI-generated tags for better categorization and discovery
- 📱 **Responsive Design** - Beautiful, clean UI that works seamlessly on desktop and mobile
- 🔐 **Secure Authentication** - JWT-based authentication with encrypted passwords
- ☁️ **Cloud Image Storage** - Store your bookmark images with ImageKit integration
- ⚡ **Real-time Caching** - Redis-powered caching for lightning-fast searches
- 🔄 **Scheduled Jobs** - Automatic data resurfacing to help you revisit important notes

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React.js
- **Styling**: SCSS
- **Build Tool**: Vite

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)

### Database & Caching

- **Database**: MongoDB
- **ORM**: Mongoose
- **Cache**: Redis (ioRedis)

### AI & ML

- **RAG Engine**: LangChain with Groq
- **AI Models**: OpenAI, Mistral AI, Groq
- **Embeddings**: AI-powered semantic analysis

### Additional Tools

- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Image Storage**: ImageKit
- **File Upload**: Multer
- **Scheduling**: Node Cron
- **Web Scraping**: Cheerio

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/smart-knowledge-brain-app.git
cd smart-knowledge-brain-app
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/smart-knowledge-brain

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Redis
REDIS_URL=redis://localhost:6379

# AI Models (Choose your providers)
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Image Storage (ImageKit)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Server
PORT=5000
NODE_ENV=development
```

### Step 5: Start MongoDB (if running locally)

```bash
mongod
```

### Step 6: Start Redis (if running locally)

```bash
redis-server
```

### Step 7: Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Step 8: Start the Frontend (in a new terminal)

```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 📖 Usage

### For Users

1. **Create an Account**
   - Visit the app and sign up with your email
   - Verify your account

2. **Add Bookmarks & Notes**
   - Click "Add Bookmark" to save web content or create notes
   - Add tags and descriptions for better organization

3. **Chat with AI Assistant**
   - Open the AI chat panel
   - Ask questions about your saved notes
   - Get AI-generated answers based on your knowledge base

4. **Explore Your Knowledge Graph**
   - View the "Knowledge Graph" to see connections between your notes
   - Click on nodes to navigate between related content

5. **Search & Filter**
   - Use the search bar to find notes by keywords
   - Filter by tags, dates, or folders

### For Developers

```bash
# Run tests
npm test

# Build for production (Backend)
npm run build

# Build for production (Frontend)
cd Frontend && npm run build
```

---

## 📁 Folder Structure

```
smart-knowledge-brain-app/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── config/                # Configuration files
│   │   │   ├── database.js        # MongoDB connection
│   │   │   └── cache.js           # Redis setup
│   │   ├── controllers/           # Request handlers
│   │   ├── models/                # Database schemas
│   │   ├── routes/                # API routes
│   │   ├── middlewares/           # Custom middlewares
│   │   ├── services/              # Business logic
│   │   ├── utils/                 # Utility functions
│   │   ├── validators/            # Input validators
│   │   └── cron/                  # Scheduled jobs
│   ├── package.json
│   ├── server.js                  # Server entry point
│   └── README.md
├── Frontend/
│   ├── src/
│   │   ├── features/              # Feature modules
│   │   │   ├── auth/              # Authentication
│   │   │   ├── bookmark/          # Bookmarks & Notes
│   │   │   └── shared/            # Shared components
│   │   ├── app.routes.jsx         # Route definitions
│   │   ├── app.store.js           # Redux store
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   └── vite.config.js
├── extension/                     # Chrome extension files
└── README.md                      # Project documentation
```

---

## 🔧 Environment Setup

### Local Development with Docker (Optional)

Use Docker to quickly set up MongoDB and Redis:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker run -d -p 6379:6379 --name redis redis:latest
```

### API Base URL

- **Development**: `http://localhost:5000`
- **Production**: Update in environment variables

---

## 📸 Screenshots

> Screenshots will be added soon to showcase:

- **Dashboard** - Overview of all bookmarks and notes
- **AI Chat Interface** - Real-time conversation with AI assistant
- **Knowledge Graph** - Visual representation of note connections
- **Search & Filter** - Powerful search capabilities
- **Mobile View** - Responsive design on mobile devices

---

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/register     - Create new account
POST   /api/auth/login        - Sign in user
GET    /api/auth/logout       - Sign out user
```

### Bookmarks

```
GET    /api/bookmarks         - Fetch all bookmarks
POST   /api/bookmarks         - Create new bookmark
PUT    /api/bookmarks/:id     - Update bookmark
DELETE /api/bookmarks/:id     - Delete bookmark
```

### AI Chat

```
POST   /api/ai/chat           - Send message to AI
GET    /api/ai/history        - Get chat history
```

### Knowledge Graph

```
GET    /api/graph             - Get graph data
GET    /api/graph/connections - Get note connections
```

> For complete API documentation, refer to the API docs file (coming soon).

---

## 🎯 Future Improvements

- [ ] **Collaborative Sharing** - Share knowledge graphs with teams
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **Advanced Analytics** - Insights and statistics about your knowledge
- [ ] **Export Features** - Export notes as PDF, DOCX, or HTML
- [ ] **Voice Notes** - Record and transcribe voice to text
- [ ] **Browser Extension** - One-click bookmark saving
- [ ] **Offline Mode** - Work without internet connection
- [ ] **Calendar View** - Timeline-based note organization
- [ ] **Integration Support** - Connect with other apps (Notion, Obsidian, etc.)
- [ ] **Multi-language Support** - Support various languages
- [ ] **Advanced Filters** - Search with complex queries
- [ ] **Dark Mode** - Eyes-friendly dark theme

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 🙋 Support

Have questions or need help?

- 📧 **Email**: support@smartbrainapp.com
- 🐛 **Issues**: [Open an issue](https://github.com/yourusername/smart-knowledge-brain-app/issues)
- 💬 **Discussions**: Join our community discussions

---

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub! It motivates us to continue improving.

---

**Made with ❤️ by the Smart Knowledge Brain Team**
