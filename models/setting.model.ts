import mongoose from "mongoose";


const settingSchema = new mongoose.Schema({
  websiteName: String,
  phone: String,
  address: String,
  email: String,
  copyright: String
}, {
  timestamps: true
});

export const settingsModel = mongoose.model("Setting", settingSchema, "settings");