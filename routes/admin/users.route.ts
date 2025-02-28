import express from "express";
import * as controller from "../../controller/admin/user.controller";
import { uploadtoCloud } from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

const route = express.Router();

route.get("", controller.index);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);
// // upload.single('thumbnail'), uploadtoCloud.uploadtoCloud,
route.patch("/edit/:id", upload.single('avatar'), uploadtoCloud, controller.editPatch);

route.patch("/change-status/:id/:status", controller.changeStatus);

route.patch("/change-many-status", controller.changeManyStatus);

route.patch("/delete/:id", controller.deleteItem);

export const routeUserAdmin = route;