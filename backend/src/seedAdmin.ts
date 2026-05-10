import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/contractly');
    
    const email = 'admin@contractly.com';
    const password = 'AdminPassword123!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      email,
      passwordHash,
      fullName: 'System Administrator',
      role: 'ADMIN',
      companyName: 'Contractly HQ'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@contractly.com');
    console.log('Password: AdminPassword123!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
