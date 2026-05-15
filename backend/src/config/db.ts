import mongoose from 'mongoose';

const connectDB = async (retries = 5): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const mongoURI = process.env.MONGO_URI;
      if (!mongoURI) {
        console.warn('WARNING: MONGO_URI is not defined in environment. Defaulting to localhost:27017');
      }
      const conn = await mongoose.connect(mongoURI || 'mongodb://localhost:27017/contractly');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error: any) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        console.log('Retrying in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  console.error('Failed to connect to MongoDB after all retries');
};

export default connectDB;
