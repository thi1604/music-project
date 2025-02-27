import express from "express";
import * as controller from "../../controller/admin/setting.controller";
import { uploadtoCloud} from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

const router = express.Router();

router.get("/general", controller.general);

router.patch("/general", 
  upload.single("logo"),
  uploadtoCloud,
  controller.generalPost
);

export const routeSetting = router;