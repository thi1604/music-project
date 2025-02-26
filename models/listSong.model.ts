import mongoose from "mongoose";


const listSongsSchema = new mongoose.Schema({
  userId: String,
  songIds: Array
}, {
  timestamps: true
});

export const listSongsModel = mongoose.model("listSongs", listSongsSchema, "list-songs");