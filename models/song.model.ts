import mongoose from "mongoose";
import slug from "mongoose-slug-updater"

mongoose.plugin(slug);

const songSchema = new mongoose.Schema({
  title: String,
  description: String,
  avatar: String,
  topicId: String,
  singerId: String,
  like: Number,
  typeLike: String,
  lyrics: String,
  audio: String,
  status: String,
  deleted: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    slug: "title",
    unique: true
  }},
  {
    timestamps: true
  }
);

export const songModel = mongoose.model("song", songSchema, "songs");