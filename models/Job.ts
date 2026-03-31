import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
