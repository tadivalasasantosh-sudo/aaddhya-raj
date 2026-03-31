import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import multer from "multer";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import fs from "fs";
import applyRoute from "./routes/apply";
import authRoute from "./routes/auth";
import usersRoute from "./routes/users";
import jobsRoute from "./routes/jobs";
import candidatesRoute from "./routes/candidates";

async function startServer() {
  const app = express();
  const PORT = 3000; // Note: Port must remain 3000 in this environment

  // Ensure uploads directory exists
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  let mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careers";
  
  // Clean up the URI: remove surrounding quotes if the user accidentally included them
  mongoUri = mongoUri.replace(/^["']|["']$/g, "").trim();
  
  // Mask credentials for safe logging
  const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  console.log(`Attempting to connect to MongoDB... (URI: ${maskedUri})`);

  if (mongoUri === "mongodb://127.0.0.1:27017/careers") {
    console.warn("WARNING: Using default localhost MongoDB URI. This will fail in the cloud environment. Please set a valid MONGODB_URI secret.");
  }

  // Validate scheme before attempting connection
  if (mongoUri && !mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    console.error("\n=======================================================");
    console.error("WARNING: Invalid MONGODB_URI scheme");
    console.error(`Your MONGODB_URI is currently set to: "${maskedUri}"`);
    console.error("It MUST start with 'mongodb://' or 'mongodb+srv://'.");
    console.error("Please update the MONGODB_URI secret in the AI Studio Settings panel.");
    console.error("=======================================================\n");
  } else if (mongoUri) {
    try {
      mongoose.set('bufferCommands', false); // Disable buffering so requests fail fast if DB is down
      mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
        .then(() => console.log("Connected to MongoDB successfully!"))
        .catch(err => {
          console.error("MongoDB connection error:", err.message);
          console.error("--> Please check your MONGODB_URI environment variable in the AI Studio Settings panel.");
          console.error("--> It should be a full connection string, e.g., mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>");
        });
    } catch (err: any) {
      console.error("MongoDB connection error (synchronous):", err.message);
    }
  }

  // API routes
  app.use("/api/apply", applyRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/users", usersRoute);
  app.use("/api/jobs", jobsRoute);
  app.use("/api/candidates", candidatesRoute);
  app.use('/uploads', express.static('uploads'));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
