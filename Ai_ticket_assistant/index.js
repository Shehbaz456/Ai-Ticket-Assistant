import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import connect_DB from "./db/index.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 8000;


// Import routes
import userRoutes from "./routes/user.js";

app.use("/api/auth", userRoutes);


connect_DB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
});
