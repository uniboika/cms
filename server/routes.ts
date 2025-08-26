import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { authenticateToken, requireRole, generateToken, AuthRequest } from "./middleware/auth";
import { initDatabase } from "./config/database";
import { z } from "zod";

const registerSchema = z.object({
  registrationNumber: z.string().min(1),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email(),
});

const verifyOtpSchema = z.object({
  registrationNumber: z.string().min(1),
  otpCode: z.string().length(6),
});

const setPasswordSchema = z.object({
  registrationNumber: z.string().min(1),
  password: z.string().min(6),
});

const loginSchema = z.object({
  registrationNumber: z.string().min(1),
  password: z.string().min(1),
});

const complaintSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['academics', 'general', 'hostel']),
  isAnonymous: z.boolean().optional().default(false),
});

const resolveComplaintSchema = z.object({
  resolutionNote: z.string().min(1),
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database
  await initDatabase();

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { registrationNumber, fullName, email } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByRegistrationNumber(registrationNumber);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Check if registration number exists in students table
      const student = await storage.getStudentByRegistrationNumber(registrationNumber);
      if (!student) {
        return res.status(400).json({ message: "Invalid registration number" });
      }

      // Generate OTP
      const otpCode = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user with OTP
      const user = await storage.createUser({
        registrationNumber,
        fullName,
        email,
        otpCode,
        otpExpires,
        role: 'student',
      });

      // Log OTP to console for testing
      console.log(`\n🔐 OTP for ${registrationNumber}: ${otpCode}\n`);

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { registrationNumber, otpCode } = verifyOtpSchema.parse(req.body);
      
      const user = await storage.getUserByRegistrationNumber(registrationNumber);
      if (!user || user.otpCode !== otpCode || !user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Clear OTP
      await storage.updateUser(user.id, { otpCode: null, otpExpires: null });

      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(400).json({ message: "OTP verification failed" });
    }
  });

  app.post("/api/auth/set-password", async (req, res) => {
    try {
      const { registrationNumber, password } = setPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByRegistrationNumber(registrationNumber);
      if (!user || user.isVerified) {
        return res.status(400).json({ message: "Invalid user or already verified" });
      }

      // Set password and verify user
      await storage.updateUser(user.id, { 
        password, 
        isVerified: true,
        otpCode: null,
        otpExpires: null 
      });

      res.json({ message: "Password set successfully" });
    } catch (error) {
      console.error("Password setup error:", error);
      res.status(400).json({ message: "Password setup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { registrationNumber, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByRegistrationNumber(registrationNumber);
      if (!user || !user.password || !user.isVerified) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.isSuspended) {
        return res.status(403).json({ message: "Account suspended due to flags" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      const { password: _, otpCode, otpExpires, ...userWithoutPassword } = user.toJSON();

      res.json({ 
        user: userWithoutPassword,
        token 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    const { password, otpCode, otpExpires, ...userWithoutPassword } = req.user!.toJSON();
    res.json(userWithoutPassword);
  });

  // Student routes
  app.post("/api/complaints", authenticateToken, requireRole(['student']), async (req: AuthRequest, res) => {
    try {
      const complaintData = complaintSchema.parse(req.body);
      
      const complaint = await storage.createComplaint({
        ...complaintData,
        studentId: req.user!.id,
      });

      res.json(complaint);
    } catch (error) {
      console.error("Create complaint error:", error);
      res.status(400).json({ message: "Failed to create complaint" });
    }
  });

  app.get("/api/complaints/my", authenticateToken, requireRole(['student']), async (req: AuthRequest, res) => {
    try {
      const complaints = await storage.getComplaintsByStudentId(req.user!.id);
      res.json(complaints);
    } catch (error) {
      console.error("Get complaints error:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  // School admin routes
  app.get("/api/admin/complaints", authenticateToken, requireRole(['school_admin']), async (req: AuthRequest, res) => {
    try {
      const complaints = await storage.getComplaintsByCategory(req.user!.category!);
      res.json(complaints);
    } catch (error) {
      console.error("Get admin complaints error:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.post("/api/admin/complaints/:id/resolve", authenticateToken, requireRole(['school_admin']), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { resolutionNote } = resolveComplaintSchema.parse(req.body);
      
      const complaint = await storage.updateComplaint(parseInt(id), {
        status: 'resolved',
        resolutionNote,
        resolvedBy: req.user!.id,
        resolvedAt: new Date(),
      });

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      res.json(complaint);
    } catch (error) {
      console.error("Resolve complaint error:", error);
      res.status(400).json({ message: "Failed to resolve complaint" });
    }
  });

  app.post("/api/admin/complaints/:id/mark-false", authenticateToken, requireRole(['school_admin']), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const complaint = await storage.getComplaintById(parseInt(id));
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      // Update complaint
      await storage.updateComplaint(parseInt(id), {
        status: 'false',
        resolutionNote: reason,
        resolvedBy: req.user!.id,
        resolvedAt: new Date(),
      });

      // Increment flag count for the student
      const student = await storage.getUserById(complaint.studentId);
      if (student) {
        const newFlagCount = student.flagCount + 1;
        const isSuspended = newFlagCount >= 3;
        
        await storage.updateUser(student.id, {
          flagCount: newFlagCount,
          isSuspended,
        });

        if (isSuspended) {
          console.log(`\n⚠️ User ${student.registrationNumber} has been suspended (Flag count: ${newFlagCount})\n`);
        }
      }

      res.json({ message: "Complaint marked as false" });
    } catch (error) {
      console.error("Mark false complaint error:", error);
      res.status(400).json({ message: "Failed to mark complaint as false" });
    }
  });

  app.post("/api/admin/complaints/:id/trace", authenticateToken, requireRole(['school_admin', 'central_admin']), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      
      const complaint = await storage.getComplaintById(parseInt(id));
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      // Create audit log
      await storage.createAuditLog({
        action: 'trace_complaint',
        adminId: req.user!.id,
        complaintId: parseInt(id),
        details: `Admin traced anonymous complaint #${id}`,
      });

      const student = await storage.getUserById(complaint.studentId);
      
      res.json({
        complaint,
        student: student ? {
          id: student.id,
          registrationNumber: student.registrationNumber,
          email: student.email,
          flagCount: student.flagCount,
          isSuspended: student.isSuspended,
        } : null,
      });
    } catch (error) {
      console.error("Trace complaint error:", error);
      res.status(400).json({ message: "Failed to trace complaint" });
    }
  });

  // Central admin routes
  app.get("/api/central-admin/complaints", authenticateToken, requireRole(['central_admin']), async (req: AuthRequest, res) => {
    try {
      const complaints = await storage.getAllComplaints();
      res.json(complaints);
    } catch (error) {
      console.error("Get all complaints error:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.get("/api/central-admin/users", authenticateToken, requireRole(['central_admin']), async (req: AuthRequest, res) => {
    try {
      const users = await storage.getAllStudents();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/central-admin/users/:id/flag", authenticateToken, requireRole(['central_admin']), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      
      const user = await storage.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newFlagCount = user.flagCount + 1;
      const isSuspended = newFlagCount >= 3;
      
      await storage.updateUser(parseInt(id), {
        flagCount: newFlagCount,
        isSuspended,
      });

      if (isSuspended) {
        console.log(`\n⚠️ User ${user.registrationNumber} has been suspended (Flag count: ${newFlagCount})\n`);
      }

      res.json({ message: "User flagged successfully" });
    } catch (error) {
      console.error("Flag user error:", error);
      res.status(400).json({ message: "Failed to flag user" });
    }
  });

  app.post("/api/central-admin/users/:id/unflag", authenticateToken, requireRole(['central_admin']), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      
      const user = await storage.getUserById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newFlagCount = Math.max(0, user.flagCount - 1);
      
      await storage.updateUser(parseInt(id), {
        flagCount: newFlagCount,
        isSuspended: false,
      });

      res.json({ message: "User unflagged successfully" });
    } catch (error) {
      console.error("Unflag user error:", error);
      res.status(400).json({ message: "Failed to unflag user" });
    }
  });

  app.get("/api/central-admin/audit-logs", authenticateToken, requireRole(['central_admin']), async (req: AuthRequest, res) => {
    try {
      const logs = await storage.getAuditLogs();
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
