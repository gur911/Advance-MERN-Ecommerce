import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", createUser); // Register a new user
router.post("/auth", loginUser); // Login user
router.post("/logout", logoutCurrentUser); // Logout user

// Protected routes
router.get("/", authenticate, authorizeAdmin, getAllUsers); // Get all users

router.get("/profile", authenticate, getCurrentUserProfile); // Get current user profile
router.put("/profile", authenticate, updateCurrentUserProfile); // Update current user profile

// Admin routes
router.delete("/:id", authenticate, authorizeAdmin, deleteUserById); // Delete user by ID
router.get("/:id", authenticate, authorizeAdmin, getUserById); // Get user by ID
router.put("/:id", authenticate, authorizeAdmin, updateUserById); // Update user by ID

export default router;
