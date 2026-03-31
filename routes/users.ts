import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const router = express.Router();

// Middleware to check if admin
const isAdmin = async (req: any, res: any, next: any) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database connection failed. Please check your MONGODB_URI secret.' });
  }

  const email = req.headers['x-user-email'];
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  
  const user = await User.findOne({ email });
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }
  next();
};

// Get all users
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create HR user
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      role: role || 'hr',
      active: true
    });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name, role, active } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, active },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
