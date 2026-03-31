import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  linkedin: String,
  portfolio: String,
  role: String,
  experience: String,
  skills: String,
  resume: String,
  additionalInfo: String,
  date: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError during hot reloading
const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

export default Candidate;
