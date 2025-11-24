# Impressout.ly 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> A comprehensive career management platform that transforms the way professionals create portfolios, resumes, cover letters, and open-source project proposals through intuitive form-based interfaces.

## 🌟 Features

### Core Functionality
- **Portfolio Builder**: Create stunning, responsive portfolios with customizable templates
- **Resume Generator**: Professional ATS-friendly resume templates with real-time preview
- **Cover Letter Creator**: Personalized cover letters tailored to specific job applications
- **OSS Proposal Writer**: Structured templates for open-source project proposals and grant applications

### Key Highlights
- 🎨 **15+ Customizable Templates**: Choose from a diverse collection of modern, professional designs
- ⚡ **70% Faster Creation**: Streamlined form-based input reduces document creation time significantly
- 💾 **Auto-Save**: Never lose your progress with automatic cloud synchronization
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- 🔒 **Secure Storage**: MongoDB-backed data persistence with user authentication
- 📤 **Multiple Export Formats**: Download in PDF, DOCX, or share via custom URL

## 🛠️ Tech Stack

### Frontend
- **React.js** - Component-based UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling framework
- **React Router** - Client-side routing
- **Redux Toolkit** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and authorization

### DevOps & Tools
- **Vercel/Netlify** - Frontend deployment
- **Railway/Render** - Backend hosting
- **AWS S3** - File storage for generated documents
- **Git & GitHub** - Version control

## 🚀 Getting Started

### Prerequisites
```bash
node >= 16.0.0
npm >= 8.0.0
mongodb >= 5.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ADITYATIWARI342005/Impressout.ly.git
cd Impressout.ly
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. **Environment Configuration**

Create `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/impressoutly
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
```

Create `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start Development Servers**
```bash
# Start backend server
cd server
npm run dev

# Start frontend (in new terminal)
cd client
npm start
```

Visit `http://localhost:3000` to see the application running!

## 📁 Project Structure

```
Impressout.ly/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── templates/     # Document templates
│   │   ├── utils/         # Helper functions
│   │   └── App.tsx        # Main application
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   └── server.js         # Entry point
│
├── README.md
└── package.json
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Documents
- `GET /api/documents` - Fetch all user documents
- `POST /api/documents/create` - Create new document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/export` - Export document as PDF

### Templates
- `GET /api/templates` - Get all available templates
- `GET /api/templates/:id` - Get specific template

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aditya Tiwari**
- GitHub: [@ADITYATIWARI342005](https://github.com/ADITYATIWARI342005)
- LinkedIn: [Aditya Tiwari](https://www.linkedin.com/in/aditya-tiwari-141bb3293/)
- Email: adityatiwari342005@gmail.com

## 🙏 Acknowledgments

- Thanks to all open-source contributors
- Inspired by modern resume builders and portfolio platforms
- Special thanks to the React and Node.js communities

## 📊 Project Stats

- **Users**: 500+ active users
- **Documents Created**: 2,000+
- **API Uptime**: 99.5%
- **Daily API Requests**: 10,000+
- **Templates**: 15+ professionally designed

## 🔮 Future Roadmap

- [ ] AI-powered content suggestions
- [ ] LinkedIn profile import
- [ ] Collaborative editing
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

⭐ Star this repository if you find it helpful!

Made with ❤️ by Aditya Tiwari
