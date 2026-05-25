const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbankick');
    console.log(`🚀 MongoDB Connected Successfully`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.log('⚠️ Server is running but Database is not connected. Please start MongoDB.');
  }
};

module.exports = connectDB;
