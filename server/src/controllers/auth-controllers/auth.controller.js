const User = require('../../models/user.model');
const { signToken } = require('../../middlewares/auth');

// REGISTER
const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: null,
        error: { code: 400, details: 'Username already taken' },
      });
    }

    const newUser = new User({ name, username, password });
    await newUser.save();

    const token = signToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          username: newUser.username,
        },
        token,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
        error: { code: 400, details: 'User not found' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
        data: null,
        error: { code: 400, details: 'Password mismatch' },
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user._id, name: user.name, username: user.username },
        token,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
        error: { code: 401, details: 'User not authenticated' },
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $inc: { tokenVersion: 1 } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

module.exports = { register, login, logout };
