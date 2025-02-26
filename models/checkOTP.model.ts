import mongoose from "mongoose";

const checkOTPSchema = new mongoose.Schema({
  userId: String,
  isGetOTP: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const checkOTPSModel = mongoose.model("check-otp", checkOTPSchema, "check-otp");