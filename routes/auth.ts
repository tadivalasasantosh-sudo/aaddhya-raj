import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection failed. Please check your MONGODB_URI secret.' });
    }

    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let user = await User.findOne({ email });

    // Bootstrap default admin
    if (!user && email === 'tadivalasasantosh@gmail.com') {
      user = new User({
        name: name || 'Admin',
        email,
        role: 'admin',
        active: true
      });
      await user.save();
    }

    if (!user) {
      return res.status(403).json({ error: 'Access denied. Account not found.' });
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Account is deactivated.' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
