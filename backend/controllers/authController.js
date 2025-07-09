const User = require('../models/User');
// const bcrypt = require('bcrypt'); // Not used – passwords stored in plain text
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Password validation function
function validatePassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  return regex.test(password);
}

// Signup controller (INSECURE - stores plain-text password)
exports.signup = async (req, res) => {
  const { name, email, password, user_type } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const emailLower = email.toLowerCase();

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 6 characters long and contain at least one letter and one number.',
    });
  }

  // 🚫 Block admin signup attempt
  if (user_type && user_type.toLowerCase() === 'admin') {
    return res.status(403).json({ message: 'Access denied: Cannot sign up as admin.' });
  }

  try {
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    console.log("WARNING: Saving plain-text password (INSECURE):", password);

    const newUser = new User({
      name,
      email: emailLower,
      password, // Insecure: should hash in real apps
      user_type: 'user', // ✅ Always default to 'user'
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};


// Login controller (INSECURE - compares plain-text passwords)
exports.login = async (req, res) => {
  let { email, password, requiredUserType } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  email = email.toLowerCase();
  if (requiredUserType) {
    requiredUserType = requiredUserType.toLowerCase();
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`Login attempt for email: ${email}`);
    console.log(`Received password: ${password.replace(/.(?=.{2})/g, '*')}`);
    console.log(`Stored password: ${user.password.replace(/.(?=.{2})/g, '*')}`);
    console.log(`Expected user_type: ${requiredUserType}`);
    console.log(`Actual user_type in DB: ${user.user_type}`);

    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (requiredUserType && user.user_type.toLowerCase() !== requiredUserType) {
      console.log(`Login failed: User type mismatch`);
      return res.status(401).json({ message: `Invalid ${requiredUserType} credentials` });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
