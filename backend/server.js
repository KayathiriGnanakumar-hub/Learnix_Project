import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import courseRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

dotenv.config();

const app = express();

/* ✅ CORS (DEV SAFE) */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      return callback(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ROUTES */
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enroll", enrollmentRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* 🚀 START SERVER */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
