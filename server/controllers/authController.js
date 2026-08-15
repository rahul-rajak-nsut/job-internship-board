const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//function to genrate a jwt  for a given user
const generateToken = ( userId , role)=>{
    return jwt.sign(
        {id: userId, role:role},  // payload — keep it minimal
        process.env.JWT_SECRET,    // secret used to sign
        {expiresIn:'7d'}            // token becomes invalid after 7 days
    );

};



// @route  POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Step 1: validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 2: check for existing user (cheap check before expensive hashing)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 3: hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 4: create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Step 5: issue token, respond WITHOUT password
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//log in
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Step 2: find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 3: compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 4: issue token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, generateToken };