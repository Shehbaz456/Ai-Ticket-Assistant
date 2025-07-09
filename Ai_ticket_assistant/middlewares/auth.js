import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    console.log("🔐 Received Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ JWT Verify Error:", err.name, err.message);
        return res.status(401).json({ error: `Unauthorized: ${err.message}` });
      }

      req.user = decoded;
      console.log("✅ Authenticated user:", decoded);
      next();
    });
  } catch (err) {
    console.error("🚨 Auth Middleware Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};
