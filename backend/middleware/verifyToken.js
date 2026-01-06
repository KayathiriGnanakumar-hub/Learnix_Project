import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("⚠️ No authorization header provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.warn("⚠️ No token in authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("🔐 Verifying token with secret:", process.env.JWT_SECRET?.substring(0, 10) + "...");
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token: " + err.message });
    }

    console.log("✅ Token verified. Decoded token:", decoded);
    req.user = decoded;
    next();
  });
};
