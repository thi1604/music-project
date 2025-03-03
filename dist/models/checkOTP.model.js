"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOTPSModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const checkOTPSchema = new mongoose_1.default.Schema({
    userId: String,
    isGetOTP: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.checkOTPSModel = mongoose_1.default.model("check-otp", checkOTPSchema, "check-otp");
