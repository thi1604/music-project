import express from "express";
import * as controller from "../../controller/admin/song,controller";
import { uploadtoCloud, uploadFieldsToCloud } from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

const route = express.Router();

route.get("", controller.index);

route.get("/create", controller.create);

route.post(
  "/create", 
  upload.fields([{name: "avatar", maxCount: 1}, {name: "audio", maxCount: 1}]), 
  uploadFieldsToCloud, 
  controller.createPost
);

export const routeSong = route;