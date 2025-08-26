import { User, Student, Complaint, AuditLog } from './models';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

export interface IStorage {
  // Auth
  getUserByRegistrationNumber(regNumber: string): Promise<User | null>;
  getUserById(id: number): Promise<User | null>;
  createUser(userData: any): Promise<User>;
  updateUser(id: number, data: any): Promise<User | null>;
  verifyUser(id: number): Promise<User | null>;

  // Students
  getStudentByRegistrationNumber(regNumber: string): Promise<Student | null>;
  getAllStudents(): Promise<Student[]>;
  
  // Complaints
  createComplaint(complaintData: any): Promise<Complaint>;
  getComplaintsByStudentId(studentId: number): Promise<Complaint[]>;
  getComplaintsByCategory(category: string): Promise<Complaint[]>;
  getAllComplaints(): Promise<Complaint[]>;
  getComplaintById(id: number): Promise<Complaint | null>;
  updateComplaint(id: number, data: any): Promise<Complaint | null>;
  
  // Audit Logs
  createAuditLog(logData: any): Promise<AuditLog>;
  getAuditLogs(): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUserByRegistrationNumber(regNumber: string): Promise<User | null> {
    return await User.findOne({ where: { registrationNumber: regNumber } });
  }

  async getUserById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async createUser(userData: any): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await User.create(userData);
  }

  async updateUser(id: number, data: any): Promise<User | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    const [updated] = await User.update(data, { where: { id } });
    if (updated) {
      return await this.getUserById(id);
    }
    return null;
  }

  async verifyUser(id: number): Promise<User | null> {
    return await this.updateUser(id, { isVerified: true });
  }

  async getStudentByRegistrationNumber(regNumber: string): Promise<Student | null> {
    return await Student.findOne({ where: { registrationNumber: regNumber } });
  }

  async getAllStudents(): Promise<Student[]> {
    return await Student.find();
  }

  async createComplaint(complaintData: any): Promise<Complaint> {
    return await Complaint.create(complaintData);
  }

  async getComplaintsByStudentId(studentId: number): Promise<Complaint[]> {
    return await Complaint.findAll({ 
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });
  }

  async getComplaintsByCategory(category: string): Promise<Complaint[]> {
    return await Complaint.findAll({ 
      where: { category },
      include: [{ model: User, as: 'student' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return await Complaint.findAll({ 
      include: [{ model: User, as: 'student' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getComplaintById(id: number): Promise<Complaint | null> {
    return await Complaint.findByPk(id, {
      include: [{ model: User, as: 'student' }]
    });
  }

  async updateComplaint(id: number, data: any): Promise<Complaint | null> {
    const [updated] = await Complaint.update(data, { where: { id } });
    if (updated) {
      return await this.getComplaintById(id);
    }
    return null;
  }

  async createAuditLog(logData: any): Promise<AuditLog> {
    return await AuditLog.create(logData);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return await AuditLog.findAll({
      include: [
        { model: User, as: 'admin' },
        { model: Complaint, as: 'complaint' }
      ],
      order: [['createdAt', 'DESC']]
    });
  }
}

export const storage = new DatabaseStorage();
