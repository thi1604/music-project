import express from "express";
const router = express.Router();
import * as controller from "../../controller/admin/topics.controller";

router.get("/", controller.index);

router.patch("/change-status/:id/:status", controller.changeStatus);


// router.get("/create", controller.create);

// const uploadtoCloud = require("../../middlewares/admin/uploadCloud.middlewares");
// const multer  = require('multer');
// const upload = multer();

// router.post(
//   "/create",
//   upload.single('thumbnail'),
//   uploadtoCloud.uploadtoCloud,
//   controller.createPost
// );

// router.get("/edit/:id", controller.edit);

// router.patch(
//   "/edit/:id",
//   upload.single('thumbnail'),
//   uploadtoCloud.uploadtoCloud,
//   controller.editPatch
// )

// router.get("/detail/:id", controller.detail);

export const routeTopicsAdmin = router;