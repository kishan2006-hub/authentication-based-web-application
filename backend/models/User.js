import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model("User", UserSchema);
