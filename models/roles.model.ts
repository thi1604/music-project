import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: []
    },
    idPersonCreated: String,
    idPersonUpdated: String,
    idPersonDeleted: String,
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps : true //Tu dong update lai time khi creat va chinh sua
  });

const role = mongoose.model("roleSchema", roleSchema, "roles");

export const rolesModel = role;
