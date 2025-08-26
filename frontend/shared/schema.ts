import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  registrationNumber: varchar("registration_number", { length: 20 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  password: text("password"),
  role: text("role", { enum: ["student", "school_admin", "central_admin"] }).notNull().default("student"),
  category: text("category", { enum: ["academics", "general", "hostel"] }), // for school_admin
  flagCount: integer("flag_count").notNull().default(0),
  isSuspended: boolean("is_suspended").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  otpCode: text("otp_code"),
  otpExpires: timestamp("otp_expires"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  registrationNumber: varchar("registration_number", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["academics", "general", "hostel"] }).notNull(),
  status: text("status", { enum: ["pending", "resolved", "false"] }).notNull().default("pending"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  studentId: integer("student_id").references(() => users.id).notNull(),
  resolutionNote: text("resolution_note"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  complaintId: integer("complaint_id").references(() => complaints.id),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  resolvedBy: true,
  resolutionNote: true,
  status: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
