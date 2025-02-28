import mongoose from "mongoose";
import slug from "mongoose-slug-updater"

mongoose.plugin(slug);

const songSchema = new mongoose.Schema({
  title: String,
  description: String,
  avatar: String,
  topicId: String,
  singerIds: Array,
  like: Number,
  lyrics: String,
  listenNumber: {
    type: Number,
    default: 1
  },
  audio: String,
  status: String,
  totalTime: String,
  idPersonCreated: String,
  idPersonUpdated: String,
  idPersonDeleted: String,
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