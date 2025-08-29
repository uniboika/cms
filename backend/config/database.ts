import { Sequelize, QueryTypes } from 'sequelize';
import { initializeModels, User, Complaint, AuditLog } from '../models';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Configure Sequelize with proper SSL and naming conventions
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false,
    // Add connection pooling for better performance
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // Add paranoid mode for soft deletes
    paranoid: true,
    deletedAt: 'deleted_at',
  },
  // Retry logic for connection
  retry: {
    max: 3,
    timeout: 30000, // 30 seconds
  }
});

// Track initialization state and prevent multiple syncs
let isInitialized = false;
let isInitializing = false;

// Initialize models and set up associations
function setupAssociations() {
  // User has many Complaints (as student)
  User.hasMany(Complaint, {
    foreignKey: 'studentId',
    as: 'complaints'
  });

  // User has many Complaints (as resolver)
  User.hasMany(Complaint, {
    foreignKey: 'resolvedBy',
    as: 'resolvedComplaints'
  });
  
  // User has many AuditLogs (as admin)
  User.hasMany(AuditLog, {
    foreignKey: 'adminId',
    as: 'adminAuditLogs'
  });
  
  // Complaint belongs to User (as student)
  Complaint.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
  });

  // Complaint belongs to User (as resolver)
  Complaint.belongsTo(User, {
    foreignKey: 'resolvedBy',
    as: 'resolver'
  });
  
  // Complaint has many AuditLogs
  Complaint.hasMany(AuditLog, {
    foreignKey: 'complaintId',
    as: 'complaintAuditLogs'
  });
  
  // AuditLog belongs to User (as admin)
  AuditLog.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin'
  });
  
  // AuditLog belongs to Complaint
  AuditLog.belongsTo(Complaint, {
    foreignKey: 'complaintId',
    as: 'complaint'
  });
}

/**
 * Safely syncs the database with the models
 * Tries different sync strategies in order of safety
 */
async function safeSync() {
  if (process.env.NODE_ENV === 'production') {
    console.log('🚨 Running in production mode - using safe sync with alter');
    try {
      await sequelize.sync({ alter: true });
      return true;
    } catch (error) {
      console.error('❌ Production sync failed:', error);
      throw error; // Fail fast in production
    }
  }

  // Development mode - try different sync strategies
  const strategies = [
    { name: 'alter', options: { alter: true } },
    { name: 'safe', options: { force: false } },
  ];

  for (const { name, options } of strategies) {
    try {
      console.log(`🔄 Attempting ${name} sync...`);
      await sequelize.sync(options);
      console.log(`✅ ${name} sync completed successfully`);
      return true;
    } catch (error) {
      console.warn(`⚠️ ${name} sync failed:`, error.message);
      // Continue to next strategy
    }
  }

  // If we get here, all sync strategies failed
  console.error('❌ All sync strategies failed');
  return false;
}

/**
 * Initialize the database connection and sync models
 * Handles connection retries and proper error handling
 */
export async function initDatabase() {
  if (isInitialized) {
    console.log('✅ Database already initialized');
    return true;
  }

  // Prevent multiple concurrent initializations
  if (isInitializing) {
    console.log('⏳ Database initialization already in progress');
    return false;
  }

  isInitializing = true;
  
  try {
    console.log('🔌 Initializing database connection...');
    
    // Test the connection first
    await sequelize.authenticate();
    console.log('🔌 Database connection established');
    
    // Initialize models
    initializeModels(sequelize);
    
    // Set up associations
    setupAssociations();
    
    // Only sync if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.log('🔄 Syncing database...');
      const syncSuccess = await safeSync();
      
      if (!syncSuccess) {
        throw new Error('Database sync failed');
      }
      
      // Run any pending migrations if using migrations
      if (process.env.RUN_MIGRATIONS === 'true') {
        console.log('🔄 Running migrations...');
        // Add migration logic here if using migrations
      }
    }
    
    isInitialized = true;
    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    // Add retry logic for transient errors
    if (error.name === 'SequelizeConnectionError' || error.name === 'ConnectionError') {
      console.log('⏳ Retrying connection in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return initDatabase(); // Recursive retry
    }
    process.exit(1);
  } finally {
    isInitializing = false;
  }
}

export { sequelize, User, Complaint, AuditLog };
