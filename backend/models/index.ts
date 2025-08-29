import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// Define enums for better type safety
export const UserRole = {
  STUDENT: 'student',
  SCHOOL_ADMIN: 'school_admin',
  CENTRAL_ADMIN: 'central_admin'
} as const;

export const ComplaintCategory = {
  ACADEMICS: 'academics',
  GENERAL: 'general',
  HOSTEL: 'hostel'
} as const;

export const ComplaintStatus = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  FALSE: 'false'
} as const;

export class User extends Model {
  declare id: number;
  declare registrationNumber: string;
  declare fullName: string;
  declare email: string;
  declare password?: string;
  declare role: typeof UserRole[keyof typeof UserRole];
  declare category?: typeof ComplaintCategory[keyof typeof ComplaintCategory];
  declare flagCount: number;
  declare isSuspended: boolean;
  declare isVerified: boolean;
  declare otpCode?: string;
  declare otpExpires?: Date;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare complaints?: Complaint[];
  declare resolvedComplaints?: Complaint[];

  static initialize(sequelize: Sequelize) {
    User.init({
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      registrationNumber: { 
        type: DataTypes.STRING(20), 
        allowNull: false, 
        unique: true,
        field: 'registration_number'
      },
      fullName: { 
        type: DataTypes.STRING, 
        allowNull: false,
        field: 'full_name'
      },
      email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: { 
        type: DataTypes.STRING,
        allowNull: true
      },
      role: { 
        type: DataTypes.ENUM(...Object.values(UserRole)), 
        allowNull: false,
        defaultValue: 'student'
      },
      category: { 
        type: DataTypes.ENUM(...Object.values(ComplaintCategory)),
        allowNull: true
      },
      flagCount: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0,
        field: 'flag_count'
      },
      isSuspended: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false,
        field: 'is_suspended'
      },
      isVerified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false,
        field: 'is_verified'
      },
      otpCode: { 
        type: DataTypes.STRING,
        allowNull: true,
        field: 'otp_code'
      },
      otpExpires: { 
        type: DataTypes.DATE,
        allowNull: true,
        field: 'otp_expires'
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true
    });
  }
}

export class Student extends Model {
  declare id: number;
  declare registrationNumber: string;
  declare name: string;
  declare email: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    Student.init({
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      registrationNumber: { 
        type: DataTypes.STRING(20), 
        allowNull: false, 
        unique: true,
        field: 'registration_number'
      },
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
          isEmail: true
        }
      }
    }, {
      sequelize,
      modelName: 'Student',
      tableName: 'students',
      underscored: true,
      timestamps: true
    });
  }
}

export class Complaint extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare category: typeof ComplaintCategory[keyof typeof ComplaintCategory];
  declare status: typeof ComplaintStatus[keyof typeof ComplaintStatus];
  declare isAnonymous: boolean;
  declare studentId: number;
  declare resolvedBy?: number;
  declare resolutionNote?: string;
  declare resolvedAt?: Date;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare student?: User;
  declare resolver?: User;
  declare auditLogs?: AuditLog[];

  static initialize(sequelize: Sequelize) {
    Complaint.init({
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      title: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
      },
      category: { 
        type: DataTypes.ENUM(...Object.values(ComplaintCategory)), 
        allowNull: false 
      },
      status: { 
        type: DataTypes.ENUM(...Object.values(ComplaintStatus)), 
        defaultValue: ComplaintStatus.PENDING,
        allowNull: false
      },
      isAnonymous: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false,
        field: 'is_anonymous'
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'student_id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      resolvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'resolved_by',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      resolutionNote: { 
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'resolution_note'
      },
      resolvedAt: { 
        type: DataTypes.DATE,
        allowNull: true,
        field: 'resolved_at'
      }
    }, {
      sequelize,
      modelName: 'Complaint',
      tableName: 'complaints',
      underscored: true,
      timestamps: true
    });
  }
}

export class AuditLog extends Model {
  declare id: number;
  declare action: string;
  declare details?: string;
  declare adminId: number;
  declare complaintId?: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare admin?: User;
  declare complaint?: Complaint;

  static initialize(sequelize: Sequelize) {
    AuditLog.init({
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      action: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      details: { 
        type: DataTypes.TEXT,
        allowNull: true 
      },
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'admin_id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      complaintId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'complaint_id',
        references: {
          model: 'complaints',
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      underscored: true,
      timestamps: true
    });
  }
}

export function initializeModels(sequelize: Sequelize) {
  // Initialize all models
  User.initialize(sequelize);
  Student.initialize(sequelize);
  Complaint.initialize(sequelize);
  AuditLog.initialize(sequelize);

  // Associations are set up in config/database.ts

  return {
    User,
    Student,
    Complaint,
    AuditLog
  };
}

// Associations are set up in config/database.ts