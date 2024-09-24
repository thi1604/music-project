import mongoose from "mongoose";

const loveSongsSchema = new mongoose.Schema({
  userId: String,
  songId: String
}, {
  timestamps: true
});

export const loveSongModel = mongoose.model("loveSong", loveSongsSchema, "love-song");