import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables.');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  const { host, port, name } = mongoose.connection;
  console.log(`MongoDB connected: ${host}:${port}/${name}`);
};

export default connectDB;

