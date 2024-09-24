import express from "express";
const router = express.Router();
import * as controller from "../../controller/client/user.controller";
import {uploadtoCloud} from "../../middlewares/admin/uploadCloud.middlewares";
import multer from "multer";

const upload = multer();

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/detail/:id", controller.detail);

router.patch(
  "/detail/edit/:id",
  upload.single("avatar"),
  uploadtoCloud,
  controller.editPatch
);
 
router.get("/change-password", controller.changePassword);

router.patch("/change-password", controller.changePasswordPatch);

router.get("/change-password/check-otp", controller.changePasswordCheckOtp);

router.patch("/change-password/check-otp", controller.changePasswordCheckOtpPatch);

// router.get("/detail/change-password/check-otp", controller.checkOtp);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", controller.forgotPasswordPost);

router.get("/password/check-otp", controller.checkOtp);

router.post("/password/check-otp", controller.checkOtpPost);

router.get("/password/reset-password", controller.resetPassword);

router.patch("/password/reset-password", controller.resetPasswordPatch);

export const routeUser = router;