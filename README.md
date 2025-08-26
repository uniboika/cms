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
- MySQL 8.0+ or PostgreSQL 13+
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd complaint-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE complaint_system;
   exit
   ```

4. **Environment configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your database credentials
   DATABASE_URL=mysql://root:password@localhost:3306/complaint_system
   JWT_SECRET=your_very_secure_jwt_secret_key_here
   OTP_MODE=console
   ```

5. **Database migration and seeding**
   ```bash
   # Seed database with sample data
   node server/seed.js
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
