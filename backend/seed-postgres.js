import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Database connection using environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});


// Models with explicit lowercase table names
const Student = sequelize.define('student', {
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'students',
  timestamps: true,
  underscored: true
});

const User = sequelize.define('user', {
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
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
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

async function seedDatabase() {
  try {
    // Skip seeding if in production unless explicitly forced
    if (process.env.NODE_ENV === 'production' && !process.env.FORCE_SEED) {
      console.log('Skipping seeding in production. Set FORCE_SEED=true to force seeding.');
      process.exit(0);
    }
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    
    console.log('🔄 Syncing database...');
    
    // Only force sync in development if explicitly requested
    const syncOptions = process.env.FORCE_SYNC === 'true' 
      ? { force: true, logging: console.log }
      : { alter: true, logging: console.log };
      
    await sequelize.sync(syncOptions);
    
    console.log('🌱 Seeding students...');
    await Student.bulkCreate([
      { registrationNumber: 'STU1001', name: 'John Doe', email: 'john.doe@student.edu' },
      { registrationNumber: 'STU1002', name: 'Jane Smith', email: 'jane.smith@student.edu' },
      { registrationNumber: 'STU1003', name: 'Bob Johnson', email: 'bob.johnson@student.edu' },
      { registrationNumber: 'STU1004', name: 'Alice Williams', email: 'alice.williams@student.edu' },
      { registrationNumber: 'STU1005', name: 'Charlie Brown', email: 'charlie.brown@student.edu' },
    ]);

    console.log('🌱 Seeding admin users...');
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log(`🔑 Admin password hash: ${hashedPassword}`);
    
    await User.bulkCreate([
      {
        registrationNumber: 'ADMIN_ACADEMICS',
        fullName: 'Dr. Sarah Academic',
        email: 'academics.admin@school.edu',
        password: hashedPassword,
        role: 'school_admin',
        category: 'academics',
        isVerified: true,
      },
      {
        registrationNumber: 'ADMIN_GENERAL',
        fullName: 'Mr. Mike General',
        email: 'general.admin@school.edu',
        password: hashedPassword,
        role: 'school_admin',
        category: 'general',
        isVerified: true,
      },
      {
        registrationNumber: 'ADMIN_HOSTEL',
        fullName: 'Ms. Helen Hostel',
        email: 'hostel.admin@school.edu',
        password: hashedPassword,
        role: 'school_admin',
        category: 'hostel',
        isVerified: true,
      },
      {
        registrationNumber: 'CENTRAL_ADMIN',
        fullName: 'Prof. David Central',
        email: 'central.admin@school.edu',
        password: hashedPassword,
        role: 'central_admin',
        isVerified: true,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n🎯 DEMO USERS & CREDENTIALS:');
    console.log('\n👥 ADMIN ACCOUNTS (Ready to Login):');
    console.log('  📚 Academics Admin: ADMIN_ACADEMICS / admin123');
    console.log('  🏢 General Admin: ADMIN_GENERAL / admin123');
    console.log('  🏠 Hostel Admin: ADMIN_HOSTEL / admin123');
    console.log('  👑 Central Admin: CENTRAL_ADMIN / admin123');
    console.log('\n🎓 STUDENT REGISTRATION NUMBERS (For New Registration):');
    console.log('  • STU1001 (John Doe)');
    console.log('  • STU1002 (Jane Smith)');
    console.log('  • STU1003 (Bob Johnson)');
    console.log('  • STU1004 (Alice Williams)');
    console.log('  • STU1005 (Charlie Brown)');
    console.log('\n📝 REGISTRATION FORMAT:');
    console.log('  Students: STU#### (e.g., STU1001)');
    console.log('  Admins: ADMIN_CATEGORY (e.g., ADMIN_ACADEMICS)');
    console.log('\n🔐 HOW TO TEST:');
    console.log('  1. Use admin credentials above to login directly');
    console.log('  2. Or register a new student using STU#### format');
    console.log('  3. During registration, check console for OTP code');
    console.log('  4. Complete registration flow and login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();