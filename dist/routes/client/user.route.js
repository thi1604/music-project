"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeUser = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller = __importStar(require("../../controller/client/user.controller"));
const multer_1 = __importDefault(require("multer"));
const user_middleware_1 = require("../../middlewares/client/user-middleware");
const upload = (0, multer_1.default)();
router.post("/register", controller.registerPost);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/change-password", controller.changePassword);
router.patch("/authenToken", controller.authenToken);
router.patch("/change-password", controller.changePasswordPatch);
router.get("/change-password/check-otp", controller.changePasswordCheckOtp);
router.patch("/change-password/check-otp", controller.changePasswordCheckOtpPatch);
router.patch("/detail", user_middleware_1.infoUser, controller.detailUser);
router.patch("/change-info/:type", user_middleware_1.infoUser, controller.changeInfo);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/check-otp", controller.checkOtp);
router.post("/password/check-otp", controller.checkOtpPost);
router.get("/password/reset-password", controller.resetPassword);
router.patch("/password/reset-password", controller.resetPasswordPatch);
exports.routeUser = router;
