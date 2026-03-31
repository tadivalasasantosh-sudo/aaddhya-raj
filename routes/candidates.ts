import express from 'express';
import mongoose from 'mongoose';
import Candidate from '../models/Candidate';
import User from '../models/User';

const router = express.Router();

// Middleware to check if Admin or HR
const isAuthorized = async (req: any, res: any, next: any) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database connection failed. Please check your MONGODB_URI secret.' });
  }

  const email = req.headers['x-user-email'];
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  
  const user = await User.findOne({ email });
  if (!user || !user.active) {
    return res.status(403).json({ error: 'Forbidden. Access denied.' });
  }
  next();
};

// Admin/HR: Get all candidates
router.get('/', isAuthorized, async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ date: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin/HR: Update candidate status
router.put('/:id/status', isAuthorized, async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin/HR: Delete candidate
router.delete('/:id', isAuthorized, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
