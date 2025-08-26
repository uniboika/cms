# EduComplaints Management System

## Overview

A comprehensive fullstack complaint management system designed for educational institutions, featuring role-based access control, OTP authentication, and administrative oversight capabilities. The system has been completely separated into independent backend and frontend applications for better maintainability, deployment flexibility, and development workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Latest Update: August 26, 2025)

### Architecture Migration
- **Separated Backend & Frontend**: Complete separation into independent applications with their own package.json files
- **Redux Integration**: Implemented Redux Toolkit for JWT token state management to resolve authentication persistence issues
- **Enhanced Landing Page**: Redesigned with modern, clean UI featuring gradients, better typography, and improved user experience
- **API Configuration**: Updated frontend to connect to backend via configurable API endpoints with CORS support
- **Independent Development**: Both applications can now run separately - backend on port 5000, frontend on port 3000

## System Architecture

### Project Structure
```
📁 Project Root
├── 📂 backend/          # Node.js + Express API Server (New)
├── 📂 frontend/         # React + Vite Client Application (New)
├── 📂 client/           # Legacy frontend (kept for reference)
├── 📂 server/           # Legacy backend (kept for reference)
└── 📂 shared/           # Shared types and schemas
```

### Backend Architecture (Port 5000)
- **Node.js + Express**: RESTful API server with CORS configuration
- **TypeScript**: Type-safe development across the entire application
- **JWT Authentication**: Stateless authentication with 7-day token expiry
- **bcryptjs**: Password hashing for secure user credential storage
- **Sequelize ORM**: Object-relational mapping with PostgreSQL
- **PostgreSQL**: Primary database automatically configured in Replit environment
- **Role-based Access Control**: Three distinct user roles with different permissions

### Frontend Architecture (Port 3000)
- **React 18 + Vite**: Modern build tool with React for fast development and optimized production builds
- **Redux Toolkit**: Centralized state management for authentication and user data
- **TanStack Query**: Server state management, caching, and synchronization
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn UI**: Pre-built component library built on Radix UI primitives
- **Wouter**: Lightweight client-side routing library
- **Lucide React**: Modern icon library for consistent iconography

### Database Design
- **Schema Structure**:
  - Users table with roles, flagging, suspension capabilities, and full name field
  - Students table for registration validation
  - Complaints table with status tracking and resolution notes
  - Audit logs table for administrative action tracking

### Authentication Flow
- **Multi-step Registration**: Registration number validation → Full name input → Email verification → OTP verification → Password setup → Login
- **Redux State Management**: JWT tokens managed through Redux store with persistence
- **API Authentication**: Automatic token inclusion in API requests via interceptors
- **Session Management**: Centralized logout functionality across all components

### Role-Based Features
- **Student Role**: Create complaints (with anonymity option), view complaint history and status
- **School Admin Role**: Manage complaints by category, resolve or flag as false, trace anonymous complaints
- **Central Admin Role**: System-wide oversight, user management, audit log access, account suspension

### Security Features
- **Anonymous Complaint Tracing**: Admin ability to trace anonymous complaints with audit logging
- **User Flagging System**: Automatic suspension when flag count reaches threshold (default: 3)
- **Audit Logging**: Comprehensive tracking of administrative actions for accountability
- **CORS Configuration**: Secure cross-origin requests between frontend and backend

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection adapter
- **@tanstack/react-query**: Client-side data fetching and state management
- **drizzle-orm**: Type-safe database query builder and schema management
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing and comparison
- **zod**: Runtime type validation for API requests

### UI Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **class-variance-authority**: Utility for creating type-safe component variants
- **clsx + tailwind-merge**: CSS class name management and conflict resolution
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool with HMR and optimized production builds
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production server builds
- **Replit Integration**: Custom plugins for Replit development environment

### Database Tools
- **drizzle-kit**: Schema migrations and database management CLI
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used with JWT)