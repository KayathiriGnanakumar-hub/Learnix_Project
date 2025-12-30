import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.json({
    message: "Dashboard access granted",
    user: req.user
  });
});

export default router;

