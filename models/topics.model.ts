import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const topicSchema = new mongoose.Schema({
  title: String,
  avatar: String,
  description: String,
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

export const topicModel = mongoose.model("topic", topicSchema, "topics");
