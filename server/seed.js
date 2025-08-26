const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/complaint_system', {
  dialect: 'mysql',
  logging: false
});

// Models (simplified for seeding)
const Student = sequelize.define('Student', {
  registrationNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
});

const User = sequelize.define('User', {
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
});

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    
    console.log('🔄 Syncing database...');
    await sequelize.sync({ force: true });
    
    console.log('🌱 Seeding students...');
    await Student.bulkCreate([
      { registrationNumber: 'STU1001', name: 'John Doe', email: 'john.doe@student.edu' },
      { registrationNumber: 'STU1002', name: 'Jane Smith', email: 'jane.smith@student.edu' },
      { registrationNumber: 'STU1003', name: 'Bob Johnson', email: 'bob.johnson@student.edu' },
    ]);

    console.log('🌱 Seeding admin users...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.bulkCreate([
      {
        registrationNumber: 'ADMIN_ACADEMICS',
        email: 'academics.admin@school.edu',
        password: hashedPassword,
        role: 'school_admin',
        category: 'academics',
        isVerified: true,
      },
      {
        registrationNumber: 'ADMIN_GENERAL',
        email: 'general.admin@school.edu',
        password: hashedPassword,
        role: 'school_admin',
        category: 'general',
        isVerified: true,
      },
      {
        registrationNumber: 'ADMIN_HOSTEL',
        email: 'hostel.admin@school.edu',
        password: hashedPassword,
        role: 'school_admin',
        category: 'hostel',
        isVerified: true,
      },
      {
        registrationNumber: 'CENTRAL_ADMIN',
        email: 'central.admin@school.edu',
        password: hashedPassword,
        role: 'central_admin',
        isVerified: true,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('📚 Academics Admin - ADMIN_ACADEMICS / admin123');
    console.log('🏢 General Admin - ADMIN_GENERAL / admin123');
    console.log('🏠 Hostel Admin - ADMIN_HOSTEL / admin123');
    console.log('👑 Central Admin - CENTRAL_ADMIN / admin123');
    console.log('\n👥 Student Registration Numbers for Testing:');
    console.log('• STU1001 (John Doe)');
    console.log('• STU1002 (Jane Smith)');
    console.log('• STU1003 (Bob Johnson)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
