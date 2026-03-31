import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Candidate from '../models/Candidate';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection failed. Please check your MONGODB_URI secret.' });
    }

    const data = new Candidate({
      ...req.body,
      resume: req.file ? req.file.filename : ''
    });

    await data.save();

    // Email to HR
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tag@aadhyarajtech.com',
        // It is recommended to use an environment variable for passwords
        pass: process.env.EMAIL_PASS || 'your_app_password'
      }
    });

    await transporter.sendMail({
      from: 'tag@aadhyarajtech.com',
      to: 'tag@aadhyarajtech.com',
      subject: `New Job Application: ${req.body.name} - ${req.body.role}`,
      text: `Name: ${req.body.name}
Email: ${req.body.email}
Phone: ${req.body.phone}
Role: ${req.body.role}
LinkedIn: ${req.body.linkedin || 'N/A'}
Portfolio: ${req.body.portfolio || 'N/A'}

Additional Information:
${req.body.additionalInfo || 'N/A'}
`
    });

    res.send('Application submitted');
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).send(err);
  }
});

export default router;
