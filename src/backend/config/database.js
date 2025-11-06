/**
 * Database Configuration
 * Centralized database connection management
 */

import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import config from './index'

/**
 * Initialize database connection
 */
export async function initDatabase() {
  try {
    // Validate MongoDB URI is set
    if (!config.mongodb.uri) {
      throw new Error('MONGODB_URI is not configured. Please set it in your .env file.')
    }
    
    await connectDB()
    console.log('✅ Database initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  try {
    await mongoose.connection.close()
    console.log('Database connection closed')
  } catch (error) {
    console.error('Error closing database:', error)
  }
}

export default {
  initDatabase,
  closeDatabase
}

