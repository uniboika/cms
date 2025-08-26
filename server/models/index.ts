import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  declare id: number;
  declare registrationNumber: string;
  declare email: string;
  declare password?: string;
  declare role: 'student' | 'school_admin' | 'central_admin';
  declare category?: 'academics' | 'general' | 'hostel';
  declare flagCount: number;
  declare isSuspended: boolean;
  declare isVerified: boolean;
  declare otpCode?: string;
  declare otpExpires?: Date;
  declare createdAt: Date;
}

export class Student extends Model {
  declare id: number;
  declare registrationNumber: string;
  declare name: string;
  declare email: string;
  declare createdAt: Date;
}

export class Complaint extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare category: 'academics' | 'general' | 'hostel';
  declare status: 'pending' | 'resolved' | 'false';
  declare isAnonymous: boolean;
  declare studentId: number;
  declare resolutionNote?: string;
  declare resolvedBy?: number;
  declare resolvedAt?: Date;
  declare createdAt: Date;
}

export class AuditLog extends Model {
  declare id: number;
  declare action: string;
  declare adminId: number;
  declare complaintId?: number;
  declare details?: string;
  declare createdAt: Date;
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: true },
  role: { 
    type: DataTypes.ENUM('student', 'school_admin', 'central_admin'), 
    allowNull: false, 
    defaultValue: 'student' 
  },
  category: { type: DataTypes.ENUM('academics', 'general', 'hostel'), allowNull: true },
  flagCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  isSuspended: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  otpCode: { type: DataTypes.STRING, allowNull: true },
  otpExpires: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: 'User' });

Student.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'Student' });

Complaint.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.ENUM('academics', 'general', 'hostel'), allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'resolved', 'false'), 
    allowNull: false, 
    defaultValue: 'pending' 
  },
  isAnonymous: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  resolutionNote: { type: DataTypes.TEXT, allowNull: true },
  resolvedBy: { type: DataTypes.INTEGER, allowNull: true },
  resolvedAt: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: 'Complaint' });

AuditLog.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false },
  adminId: { type: DataTypes.INTEGER, allowNull: false },
  complaintId: { type: DataTypes.INTEGER, allowNull: true },
  details: { type: DataTypes.TEXT, allowNull: true },
}, { sequelize, modelName: 'AuditLog' });

// Associations
User.hasMany(Complaint, { foreignKey: 'studentId', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

User.hasMany(Complaint, { foreignKey: 'resolvedBy', as: 'resolvedComplaints' });
Complaint.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

User.hasMany(AuditLog, { foreignKey: 'adminId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

Complaint.hasMany(AuditLog, { foreignKey: 'complaintId', as: 'auditLogs' });
AuditLog.belongsTo(Complaint, { foreignKey: 'complaintId', as: 'complaint' });
