import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expireAt: {
    type: Date,
    expires: 0
  }
}, {
  timestamps: true
});

export const forgotPasswordModel = mongoose.model("forgotPassword", forgotPasswordSchema, "forgot-password");

