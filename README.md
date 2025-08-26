# EduComplaints Management System

A comprehensive fullstack complaint management system designed for educational institutions, featuring role-based access control, OTP authentication, and administrative oversight capabilities.

## 🚀 Architecture

This project has been separated into independent frontend and backend applications for better maintainability and deployment flexibility.

```
📁 Project Structure
├── 📂 backend/          # Node.js + Express API Server
├── 📂 frontend/         # React + Vite Client Application  
├── 📂 client/           # Legacy frontend (keep for reference)
├── 📂 server/           # Legacy backend (keep for reference)
└── 📂 shared/           # Shared types and schemas
```

## 🛠️ Technology Stack

### Backend
- **Node.js + Express** - RESTful API server
- **PostgreSQL** - Primary database (auto-configured in Replit)
- **Sequelize ORM** - Database management and migrations
- **JWT Authentication** - Stateless authentication with 7-day token expiry
- **bcryptjs** - Secure password hashing
- **TypeScript** - Type-safe development

### Frontend  
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful component library
- **Redux Toolkit** - State management for authentication
- **TanStack Query** - Server state management and caching
- **Wouter** - Lightweight client-side routing

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (automatically configured in Replit)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

4. **Run database migrations and seed:**
   ```bash
   npm run db:push
   npm run seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The API server will be running at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Configure VITE_API_URL to point to your backend
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The React app will be running at `http://localhost:3000`

## 👥 User Roles & Access

### 🎓 Students
- Submit complaints across categories (Academic, Hostel, General)
- Optional anonymous complaint submission
- Real-time status tracking and updates
- View complete complaint history
- **Test Account:** `STU1001` / `password123`

### 🏫 School Admins  
- Category-specific complaint management
- Resolve complaints with detailed notes
- Trace anonymous complaints (with audit logging)
- Flag false/inappropriate complaints
- **Test Account:** `ADMIN_ACADEMICS` / `admin123`

### 🛡️ Central Admins
- System-wide complaint oversight
- User account management and suspension
- Comprehensive audit log access
- Platform administration tools
- **Test Account:** `CENTRAL_ADMIN` / `admin123`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Multi-step registration process
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/set-password` - Password setup
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user info

### Complaints (Students)
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints/my` - Get user's complaints

### Admin Management
- `GET /api/admin/complaints` - Get complaints by category
- `PUT /api/complaints/:id/resolve` - Resolve complaint
- `POST /api/admin/trace/:id` - Trace anonymous complaint

### Central Admin
- `GET /api/central-admin/users` - User management
- `GET /api/central-admin/audit-logs` - Audit trail
- `PUT /api/admin/users/:id/suspend` - Suspend user accounts

## 🗄️ Database Schema

### Users Table
- Registration number validation through Students table
- Role-based access control (student, school_admin, central_admin)
- Account flagging and suspension capabilities
- Full name field for complete user profiles

### Complaints Table
- Categorized complaints (academics, hostel, general)
- Status tracking (pending, resolved, false)
- Anonymous submission support with tracing capability
- Resolution notes and timestamps

### Audit Logs Table
- Comprehensive action tracking for administrative activities
- Admin accountability and transparency
- Complaint tracing history

## 🔒 Security Features

### Authentication & Authorization
- JWT-based stateless authentication
- Role-based route protection
- Secure password hashing with bcryptjs
- Multi-step registration with OTP verification

### Privacy & Anonymity
- Optional anonymous complaint submission
- Admin tracing capability with audit logging
- User flagging system with automatic suspension
- Secure session management

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm start
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting provider
```

### Environment Variables

**Backend (.env):**
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=your-postgresql-connection-string
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend-domain.com
```

## 🧪 Testing Accounts

The system comes pre-seeded with test accounts for all user types:

**Students:**
- STU1001, STU1002, STU1003, STU1004, STU1005
- Password: `password123` for all student accounts

**School Admins:**
- ADMIN_ACADEMICS (Academic complaints)
- ADMIN_HOSTEL (Hostel complaints)  
- ADMIN_GENERAL (General complaints)
- Password: `admin123` for all admin accounts

**Central Admin:**
- CENTRAL_ADMIN
- Password: `admin123`

## 🎨 UI Components

The frontend uses a modern design system built with:
- **Shadcn UI** - Consistent, accessible components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations
- **Responsive Design** - Works on all device sizes

## 📚 Development

### Code Structure
```
backend/
├── config/         # Database configuration
├── middleware/     # Express middlewares (auth, etc.)
├── models/         # Sequelize models
├── shared/         # Shared types and schemas
├── index.ts        # Express server entry point
└── routes.ts       # API route definitions

frontend/
├── src/
│   ├── components/ # Reusable UI components
│   ├── pages/      # Route components
│   ├── hooks/      # Custom React hooks
│   ├── lib/        # Utilities and configurations
│   └── store/      # Redux store and slices
└── public/         # Static assets
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [Issues](../../issues) section
- Review the documentation
- Contact the development team

---

**Built with ❤️ for educational institutions seeking efficient complaint management solutions.**