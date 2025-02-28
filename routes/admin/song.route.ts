import express from "express";
import * as controller from "../../controller/admin/song,controller";
import { uploadtoCloud, uploadFieldsToCloud } from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

const route = express.Router();

route.get("", controller.index);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);
// upload.single('thumbnail'), uploadtoCloud.uploadtoCloud,
route.patch("/edit/:id", upload.single('avatar'), uploadtoCloud, controller.editPatch);

route.get("/create", controller.create);

route.patch("/change-status/:id/:status", controller.changeStatus);

route.post(
  "/create", 
  upload.fields([{name: "avatar", maxCount: 1}, {name: "audio", maxCount: 1}]), 
  uploadFieldsToCloud, 
  controller.createPost
);

route.patch("/delete/:id", controller.deleteItem);

route.patch("/change-many-status", controller.changeManyStatus);

route.patch("/delete/:id", controller.deleteItem);

export const routeSong = route;