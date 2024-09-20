import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const singerSchema = new mongoose.Schema({
  fullName: String,
  avatar: String,
  status: String,
  deleted: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    slug: "fullName",
    unique: true
  }
}, {
  timestamps: true
});

export const singerModel = mongoose.model("singer", singerSchema, "singer");