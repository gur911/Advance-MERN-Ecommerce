import mongoose from "mongoose";

// Define the user schema
const userSchema = mongoose.Schema(
  {
    // Username field: String type, required
    username: {
      type: String,
      required: true,
    },
    // Email field: String type, required and unique across documents
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Password field: String type, required (typically used for storing hashed passwords)
    password: {
      type: String,
      required: true,
    },
    // isAdmin field: Boolean type, required with a default value of false
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  // Options object for schema configuration
  { timestamps: true } // Adds createdAt and updatedAt timestamps to documents
);

// Create the User model based on the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model
export default User;
