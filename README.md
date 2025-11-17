# SEO Keyword Research Tool

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/yourusername/seokwtool4)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)

A comprehensive, full-stack SEO keyword research platform powered by the DataForSEO API. Built with modern web technologies for professional SEO specialists, digital marketers, and content creators.

## 🌟 Features

### Core Capabilities
- 🔐 **Secure Authentication** - JWT-based user registration and login
- 📊 **Keyword Research** - Comprehensive keyword analysis by seed keyword or competitor domain
- 📁 **Project Management** - Organize keywords by projects and campaigns
- 💾 **Data Persistence** - PostgreSQL database for reliable data storage
- 🎯 **Advanced Metrics** - Search volume, keyword difficulty, CPC, and competition data
- ❓ **People Also Ask** - Extract PAA questions from Google SERP
- 🤖 **AI Overview** - Capture Google's AI-generated summaries
- ⚡ **Real-Time Search** - Fast, responsive keyword lookups
- 📈 **Sortable Results** - Sort by volume, difficulty, CPC, or keyword

### Technical Highlights
- **Full-Stack Architecture** - Separate backend API and React frontend
- **Enterprise Security** - Rate limiting, CORS, input validation, password hashing
- **Modern Stack** - React 18, Node.js, Express, PostgreSQL, Tailwind CSS
- **API Integration** - DataForSEO Labs and SERP APIs
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Professional UI** - Clean, intuitive interface with Inter font

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **DataForSEO API credentials** - [Sign up](https://dataforseo.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/seokwtool4.git
cd seokwtool4
```

**2. Install dependencies**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

**3. Set up PostgreSQL database**

Create a new PostgreSQL database:

```bash
# On macOS (using psql)
psql postgres
CREATE DATABASE seo_tool_db;
\q
```

**4. Configure environment variables**

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seo_tool_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# DataForSEO API
DATAFORSEO_LOGIN=your_dataforseo_email
DATAFORSEO_PASSWORD=your_dataforseo_password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**5. Start the development servers**

From the root directory:

```bash
# Start both backend and frontend (using concurrently)
npm run dev

# OR start them separately:

# Terminal 1 - Backend API
cd backend && npm run dev

# Terminal 2 - Frontend React app
cd frontend && npm run dev
```

**6. Access the application**

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📖 Usage Guide

### Getting Started

1. **Create an Account**
   - Visit http://localhost:3000/register
   - Enter your name, email, and password
   - Click "Create Account"

2. **Perform Keyword Research**
   - Go to the "Keyword Research" tab
   - Enter a seed keyword (e.g., "best running shoes")
   - Select your target location
   - Click "Search"
   - View keyword ideas with metrics

3. **Save Keywords to Projects**
   - Select keywords using checkboxes
   - Choose an existing project or create a new one
   - Click "Save X keywords"

4. **Manage Projects**
   - Switch to the "Projects" tab
   - View all your saved keywords organized by project
   - Edit project names or delete projects
   - Expand projects to see keyword details

5. **Competitor Research**
   - Switch to "By Domain" tab
   - Enter a competitor's domain (e.g., "nike.com")
   - View all keywords they rank for
   - Save interesting keywords to your projects

---

## 🏗️ Project Structure

```
seokwtool4/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Sequelize models (User, Project, Keyword)
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js     # Authentication endpoints
│   │   │   ├── projects.js # Project CRUD
│   │   │   ├── keywords.js # Keyword management
│   │   │   └── seo.js      # DataForSEO integration
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # DataForSEO service
│   │   └── server.js       # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── KeywordResearch.jsx
│   │   │   └── ProjectList.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS and Tailwind
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/                   # Documentation
│   └── BUG_SOLUTIONS.md    # Troubleshooting guide
│
├── package.json            # Root workspace config
├── CHANGELOG.md            # Version history
└── README.md               # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/password` | Change password | Yes |
| DELETE | `/api/auth/account` | Delete account | Yes |

### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all user projects | Yes |
| GET | `/api/projects/:id` | Get single project | Yes |
| POST | `/api/projects` | Create project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |

### Keyword Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/keywords/project/:projectId` | Get project keywords | Yes |
| POST | `/api/keywords` | Add keyword | Yes |
| POST | `/api/keywords/bulk` | Add multiple keywords | Yes |
| PUT | `/api/keywords/:id` | Update keyword | Yes |
| DELETE | `/api/keywords/:id` | Delete keyword | Yes |

### SEO Research Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/seo/research` | Comprehensive keyword research | Yes |
| POST | `/api/seo/related-keywords` | Get related keywords | Yes |
| POST | `/api/seo/keyword-suggestions` | Get keyword suggestions | Yes |
| POST | `/api/seo/keyword-metrics` | Get keyword metrics | Yes |
| POST | `/api/seo/domain-keywords` | Get domain keywords | Yes |
| POST | `/api/seo/serp-data` | Get SERP data (PAA, AI Overview) | Yes |

### Example API Request

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'

# Keyword research (with auth token)
curl -X POST http://localhost:5000/api/seo/research \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "keyword": "best running shoes",
    "locationCode": 2840,
    "languageCode": "en"
  }'
```

---

## 🛠️ Development

### Available Scripts

#### Root Directory
```bash
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build           # Build both for production
npm run install:all      # Install all dependencies
```

#### Backend
```bash
npm run dev             # Start with nodemon (hot reload)
npm start               # Start production server
npm test                # Run tests
```

#### Frontend
```bash
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Database Management

```bash
# Connect to database (macOS)
psql -U postgres -d seo_tool_db

# View tables
\dt

# View specific table
SELECT * FROM users;

# Reset database (WARNING: deletes all data)
DROP DATABASE seo_tool_db;
CREATE DATABASE seo_tool_db;
```

The application will automatically create tables on first run using Sequelize's `sync()` method.

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, expiring authentication tokens
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: express-validator on all inputs
- **CORS Protection**: Configured allowed origins
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **XSS Protection**: Helmet.js security headers
- **HTTPS Ready**: Production-ready configuration

---

## 🐛 Troubleshooting

Common issues and solutions are documented in [docs/BUG_SOLUTIONS.md](docs/BUG_SOLUTIONS.md).

### Quick Fixes

**Database connection failed**
```bash
# Check PostgreSQL is running (macOS)
brew services list
brew services start postgresql

# Verify credentials in backend/.env
```

**Port already in use**
```bash
# Find process using port (macOS)
lsof -i :5000
kill -9 <PID>
```

**Dependencies not installing**
```bash
# Clear npm cache
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📚 Tech Stack

### Backend
- **Runtime**: Node.js v16+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 12+
- **ORM**: Sequelize 6.35
- **Authentication**: JWT (jsonwebtoken 9.0)
- **Security**: Helmet, CORS, bcryptjs, express-rate-limit
- **Validation**: express-validator 7.0

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Routing**: React Router 6.21
- **HTTP Client**: Axios 1.6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts 2.10

### External APIs
- **DataForSEO API v3**
  - DataForSEO Labs API (Keyword Research)
  - SERP API (Organic Results)

---

## 🗺️ Roadmap

### ✅ Phase 1 - Complete (v0.2.0)
- User authentication system
- Database schema and models
- Keyword research functionality
- Project management
- Basic UI/UX

### 🚧 Phase 2 - In Progress
- Email verification
- Password reset functionality
- CSV/Excel export
- Advanced filtering
- Bulk keyword import

### 📅 Phase 3 - Planned
- SERP position tracking
- Competitor rank monitoring
- Content gap analysis
- Historical data charts
- API usage dashboard

### 🔮 Phase 4 - Future
- Team collaboration
- API rate optimization
- Advanced caching (Redis)
- Mobile app (React Native)
- White-label options

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Powered by [DataForSEO API](https://dataforseo.com/)
- UI design inspired by best practices in SaaS applications
- Font: [Inter](https://rsms.me/inter/) by Rasmus Andersson

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/seokwtool4/issues)
- **Email**: support@example.com
- **Documentation**: [docs/](docs/)

---

## 🌐 Deployment

### Production Checklist

Before deploying to production:

- [ ] Update JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production frontend URL
- [ ] Enable database backups
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure logging
- [ ] Test all API endpoints
- [ ] Load test the application

### Recommended Hosting

- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: AWS RDS, Heroku Postgres, DigitalOcean Managed Database

---

**Made with ❤️ for SEO professionals** | Version 0.2.0 | [Changelog](CHANGELOG.md)
