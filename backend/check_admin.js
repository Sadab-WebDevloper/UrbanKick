const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbankick');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('✅ Admin user found:', admin.email);
    } else {
      console.log('❌ No admin user found.');
    }
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

checkAdmin();
