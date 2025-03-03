"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    tokenUser: String,
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dddqj4xho/image/upload/v1722671580/0d64989794b1a4c9d89bff571d3d5842_jrbalx.jpg"
    },
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.userModel = mongoose_1.default.model("User", userSchema, "user");
