import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  tokenUser: String,
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dddqj4xho/image/upload/v1722671580/0d64989794b1a4c9d89bff571d3d5842_jrbalx.jpg"
  },
  status: {
    type: String,
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const userModel = mongoose.model("User", userSchema, "user");

