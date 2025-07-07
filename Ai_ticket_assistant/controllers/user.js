import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";


export const signup = async (req, res) => {
  const { email, password, role,skills = [] } = req.body;
  try {
    // const existingUser = await User.find({ email });
    // if (existingUser) {
    //   return res.status(400).json({ error: "User already exists" });
    // }
    
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role,skills });
    console.log(`user: ${user}`);
    
    // fire Inngest event for user signup
    await inngest.send({ name: "user/signup", data: { email } });
    
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
   
    
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Error signing up user:", error.message);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    });

    // await User.updateOne({ _id: req.user._id }, { $set: { token: null } });

    return res.status(200).json({ error: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error.message);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], email, role } = req.body;
  try {
    if (req.user.role !== "admin" && role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (!email || !skills) {
      return res.status(400).json({ error: "Email and skills are required" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills: skills.length ? skills : user.skills, email, role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // fire Inngest event for user update
    await inngest.send({ name: "user/update", data: { email, skills: skills.length ? skills : user.skills, role } });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const users = await User.find().select("-password -__v");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
