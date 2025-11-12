/**
 * Backend Configuration
 * Manages environment variables and configuration settings
 */

export const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || process.env.MONGO_URI || '',
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // Google Cloud Configuration
  gcloud: {
    project: process.env.GCLOUD_PROJECT || '',
    bucket: process.env.GCLOUD_BUCKET || '',
    clientEmail: process.env.GCLOUD_CLIENT_EMAIL || '',
    privateKey: process.env.GCLOUD_PRIVATE_KEY || ''
  },
  
  // Gemini AI Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || ''
  },
  
  // AWS S3 Configuration (if using)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || ''
  },
  
  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
}

// Validate required configurations
export function validateConfig() {
  const errors = []
  
  if (!config.mongodb.uri) {
    errors.push('MONGODB_URI is required')
  }
  
  if (config.nodeEnv === 'production' && config.jwt.secret === 'default-secret-key-change-in-production') {
    errors.push('JWT_SECRET must be set in production')
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ Configuration warnings:', errors)
  }
  
  return errors.length === 0
}

// Export default
export default config








