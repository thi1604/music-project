import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const singerSchema = new mongoose.Schema({
  fullName: String,
  avatar: String,
  status: String,
  outStanding: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  idPersonCreated: String,
  idPersonUpdated: String,
  idPersonDeleted: String,
  description: String,
  slug: {
    type: String,
    slug: "fullName",
    unique: true
  }
}, {
  timestamps: true
});

export const singerModel = mongoose.model("singer", singerSchema, "singer");