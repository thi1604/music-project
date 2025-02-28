import express from "express";
const router = express.Router();
import * as controller from "../../controller/admin/topics.controller";
import { uploadtoCloud, uploadFieldsToCloud } from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

router.get("/", controller.index);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single('avatar'),
  uploadtoCloud,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadtoCloud,
  controller.editPatch
)


router.get("/detail/:id", controller.detail);

router.patch("/delete/:id", controller.deleteItem);

export const routeTopicsAdmin = router;