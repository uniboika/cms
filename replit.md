# Complaint Management System

## Overview

A fullstack web application for educational institutions to manage student complaints with role-based access control, OTP authentication, and administrative oversight features. The system allows students to submit complaints in various categories (academics, general, hostel) with optional anonymity, while providing administrators with tools to resolve complaints, trace anonymous submissions, and manage user accounts with flagging and suspension capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Vite + React**: Modern build tool with React for fast development and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Wouter**: Lightweight client-side routing library as an alternative to React Router
- **TanStack Query**: Data fetching, caching, and synchronization for server state management
- **Shadcn UI**: Pre-built component library built on Radix UI primitives for consistent design

### Backend Architecture
- **Node.js + Express**: RESTful API server with Express framework
- **TypeScript**: Type-safe development across the entire application
- **JWT Authentication**: Stateless authentication with 7-day token expiry
- **bcryptjs**: Password hashing for secure user credential storage
- **Role-based Access Control**: Three distinct user roles (student, school_admin, central_admin) with different permissions

### Database Design
- **Drizzle ORM**: Type-safe SQL query builder with PostgreSQL dialect
- **PostgreSQL**: Primary database configured via Drizzle, though the codebase shows migration from Sequelize/MySQL
- **Schema Structure**:
  - Users table with roles, flagging, and suspension capabilities
  - Students table for registration validation
  - Complaints table with status tracking and resolution notes
  - Audit logs table for administrative action tracking

### Authentication Flow
- **Multi-step Registration**: Registration number validation → Email verification → OTP verification → Password setup → Login
- **OTP System**: Console-based OTP delivery for development (configurable for email)
- **Session Management**: JWT tokens stored in localStorage with automatic logout on expiry

### Role-Based Features
- **Student Role**: Create complaints (with anonymity option), view complaint history and status
- **School Admin Role**: Manage complaints by category, resolve or flag as false, trace anonymous complaints
- **Central Admin Role**: System-wide oversight, user management, audit log access, account suspension

### Security Features
- **Anonymous Complaint Tracing**: Admin ability to trace anonymous complaints with audit logging
- **User Flagging System**: Automatic suspension when flag count reaches threshold (default: 3)
- **Audit Logging**: Comprehensive tracking of administrative actions for accountability

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