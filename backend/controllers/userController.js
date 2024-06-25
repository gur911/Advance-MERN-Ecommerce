import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    res.status(400).json({ error: "Please fill all the inputs." });
    return;
  }

  // Check if user with the same email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// @desc    Authenticate user and get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400).json({ error: "Please provide email and password" });
    return;
  }

  // Find user by email
  const existingUser = await User.findOne({ email });

  // Check if user exists
  if (!existingUser) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  // Generate JWT token and set as HTTP-only cookie
  createToken(res, existingUser._id);

  // Respond with user details and status
  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});

// @desc    Logout current user
// @route   GET /api/users/logout
// @access  Private
const logoutCurrentUser = asyncHandler(async (req, res) => {
  // Clear JWT cookie to log out user
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  // Respond with success message
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Find all users and return them
  const users = await User.find({});
  res.json(users);
});

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  // Find current user by ID and return profile details
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  // Find current user by ID
  const user = await User.findById(req.user._id);

  if (user) {
    // Update user fields if provided
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      // Hash and update password if provided
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    // Save updated user details
    const updatedUser = await user.save();

    // Respond with updated user details
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserById = asyncHandler(async (req, res) => {
  // Find user by ID
  const user = await User.findById(req.params.id);

  if (user) {
    // Prevent deletion of admin user
    if (user.isAdmin) {
      res.status(400).json({ error: "Cannot delete admin user" });
      return;
    }

    // Delete user from database
    await User.deleteOne({ _id: user._id });

    // Respond with success message
    res.json({ message: "User removed" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // Find user by ID and exclude password field
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    // Respond with user details
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserById = asyncHandler(async (req, res) => {
  // Find user by ID
  const user = await User.findById(req.params.id);

  if (user) {
    // Update user fields if provided
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    // Save updated user details
    const updatedUser = await user.save();

    // Respond with updated user details
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
