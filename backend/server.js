import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollRoutes from "./routes/enrollRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();

const app = express();

/* =========================
   FIXED CORS (ALL VITE PORTS)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, Thunder Client)
      if (!origin) return callback(null, true);

      // allow all localhost ports (5173, 5174, 5175, 5180, etc.)
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enroll", enrollRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("✅ Backend running");
});

/* =========================
   SERVER START
========================= */
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
