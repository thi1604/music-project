import express from "express";
import * as controller from "../../controller/admin/account.controller";
import { uploadtoCloud} from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

const route = express.Router();

route.get("", controller.index);

route.get("/detail/:id", controller.detail);

route.get("/edit/:id", controller.edit);

route.patch("/edit/:id", upload.single('avatar'), uploadtoCloud, controller.editPatch);

route.get("/create", controller.create);

route.patch("/change-status/:id/:status", controller.changeStatus);

route.post(
  "/create", 
  upload.single("avatar"), 
  uploadtoCloud, 
  controller.createPost
);

route.patch("/delete/:id", controller.deleteItem);

// route.patch("/change-many-status", controller.changeManyStatus);

export const routeAccount = route;