const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc Register new user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
  }

  // 1. Validate Names
  if (!firstName || firstName.length < 2) {
    return res.status(400).json({ message: 'Please enter your first name' });
  }
  if (!lastName || lastName.length < 2) {
    return res.status(400).json({ message: 'Please enter your last name' });
  }

  // 2. Validate Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  // 3. Validate Password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters long and include one uppercase letter and one special character' 
    });
  }
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ 
      firstName,
      lastName,
      email, 
      password, 
      role: 'user' 
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
};

// @desc Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      // Check if user is active
      if (user.isActive === false) {
        return res.status(403).json({ 
          message: 'Account deactivated. Please contact admin support.' 
        });
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Logout user
exports.logoutUser = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
