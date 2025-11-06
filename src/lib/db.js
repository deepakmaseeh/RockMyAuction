import mongoose from "mongoose";

let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // Use MONGODB_URI from environment (supports both MONGODB_URI and MONGO_URI)
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  
  if (!mongoUri) {
    const error = new Error("Missing MONGODB_URI or MONGO_URI in environment variables");
    console.error('❌ Database Configuration Error:', error.message);
    console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
    throw error;
  }

  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Cache the connection
    cachedConnection = conn;
    
    // Handle connection errors after initial connect
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      cachedConnection = null; // Reset cache on error
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      cachedConnection = null;
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    cachedConnection = null;
    throw error;
  }
}

// Also export as default for compatibility
export default connectDB;
