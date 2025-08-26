# Complaint Management System - MVP

A fullstack web application for educational institutions to manage student complaints with role-based access control, OTP authentication, and administrative oversight features.

## Tech Stack

### Frontend
- **Vite** - Build tool and dev server
- **React** (JavaScript) - UI framework
- **Tailwind CSS** - Styling
- **Wouter** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Shadcn UI** - Component library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize ORM** - Database modeling
- **MySQL** - Database (preferred) / PostgreSQL supported
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features

### Authentication System
- **Registration Flow**: Student registration number → Email → OTP verification → Password setup → Login
- **OTP Verification**: Console-based for testing (configurable to email)
- **JWT Authentication**: Secure token-based auth with 7-day expiry
- **Role-based Access**: Three user roles with different permissions

### User Roles

#### 1. Student
- Submit complaints with title, description, and category (academics/general/hostel)
- Anonymous complaint option with confirmation warning
- View complaint history and status updates
- Track resolution notes and admin responses

#### 2. School Admin
- Category-specific complaint management
- Mark complaints as resolved with resolution notes
- Flag false reports (increments user flag count)
- Anonymous complaint tracing with audit logging

#### 3. Central Admin
- System-wide complaint overview across all categories
- User management and flagging capabilities
- Audit log access for administrative actions
- User account suspension/reactivation

### Security & Compliance
- **Anonymous Tracing**: Admins can trace anonymous complaints with audit trail
- **Flagging System**: False reports increment user flag count
- **Auto-suspension**: Accounts suspended when flag count ≥ 3
- **Audit Logging**: All administrative actions logged for compliance

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+ (automatically provided in Replit)

### Step-by-Step Guide

#### Step 1: Install Dependencies
The dependencies should already be installed, but if needed:
```bash
npm install
```

#### Step 2: Database Setup
The PostgreSQL database is automatically configured in Replit. The connection details are provided via environment variables:
- `DATABASE_URL` - Complete database connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual connection parameters

#### Step 3: Start the Application
In Replit, simply **click the "Run" button** or use the workflow named "Start application". This runs:
```bash
npm run dev
```

This single command starts both:
- **Backend server** on port 5000 (Express.js API)
- **Frontend development server** (Vite with React)

#### Step 4: Access the Application
The application will automatically open in Replit's webview. You can also access it via the generated URL.

### What Happens When You Run the App

1. **Database Connection**: Automatically connects to PostgreSQL using Replit's environment variables
2. **Database Sync**: Creates and synchronizes all required tables:
   - Users (with roles, flagging, and suspension capabilities)
   - Students (for registration validation)
   - Complaints (with status tracking and resolution notes)
   - AuditLogs (for administrative action tracking)
3. **Server Start**: Express.js API server starts on port 5000
4. **Frontend Build**: Vite development server with hot module replacement
5. **Ready to Use**: Registration and login pages become available

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Project Structure

```
├── client/               # Frontend (React + Vite)
│   ├── src/             # React components and pages
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-based page components
│   │   └── hooks/       # Custom React hooks
│   └── index.html       # HTML entry point
├── server/              # Backend (Express.js)
│   ├── index.ts         # Main server file
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── models/          # Database models
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── package.json         # Dependencies and scripts
```

### First Time Setup

1. **Click the Run button** - This will start both frontend and backend
2. **Wait for database sync** - You'll see "Database synchronized" in the console
3. **Access the app** - The webview will show the login/registration page
4. **Create an account** - Use the registration flow to set up your first user

### Available Scripts

```bash
# Start both frontend and backend in development mode
npm run dev

# Build the application for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push
```

### Troubleshooting

- **Database connection issues**: The database should connect automatically using Replit's environment variables
- **Port conflicts**: The app uses port 5000 for the backend, Vite handles the frontend
- **Build errors**: Check the console for any missing dependencies or TypeScript errors

