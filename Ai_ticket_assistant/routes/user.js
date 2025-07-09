import express from "express";
import { signup, login, logout, updateUser, getUsers } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Authenticated routes
router.post("/logout", isAuthenticated, logout);
router.put("/update-user", isAuthenticated, updateUser);
router.get("/users", isAuthenticated, getUsers);

export default router;