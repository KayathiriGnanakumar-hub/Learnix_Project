import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

/* DATABASE INITIALIZATION */
import initializeDatabase from "./scripts/initializeDatabase.js";

/* ROUTES */
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollRoutes from "./routes/enrollRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminVideoRoutes from "./routes/adminVideoRoutes.js";
import adminQuizRoutes from "./routes/adminQuizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";


dotenv.config();

const app = express();

/* =========================
   CORS (ALL LOCALHOST PORTS)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"), false);
    },
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   SERVE STATIC FILES (IMAGES)
========================= */
// Serve images from public folder
app.get("/:filename.jpg", (req, res) => {
  const imagePath = path.join(process.cwd(), "../vite-project/public", req.params.filename + ".jpg");
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
});

// Also serve PNG files
app.get("/:filename.png", (req, res) => {
  const imagePath = path.join(process.cwd(), "../vite-project/public", req.params.filename + ".png");
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enroll", enrollRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/videos", videoRoutes);

/* ADMIN CONTENT */
app.use("/api/admin/videos", adminVideoRoutes);
app.use("/api/admin/quizzes", adminQuizRoutes);

/* STUDENT PROGRESS */
app.use("/api/progress", progressRoutes);

/* CERTIFICATES */
app.use("/api/certificates", certificateRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend running");
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  
  // Initialize database tables and triggers
  initializeDatabase();
});
