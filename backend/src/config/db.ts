import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.warn('WARNING: MONGO_URI is not defined in environment. Defaulting to localhost:27017');
    }
    const conn = await mongoose.connect(mongoURI || 'mongodb://localhost:27017/contractly');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
