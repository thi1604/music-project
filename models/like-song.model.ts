import mongoose from "mongoose";

const likeSongsSchema = new mongoose.Schema({
  userId: String,
  songId: String,
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const likeSongModel = mongoose.model("likeSong", likeSongsSchema, "like-song");
