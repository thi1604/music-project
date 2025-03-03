"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const settingSchema = new mongoose_1.default.Schema({
    websiteName: String,
    phone: String,
    address: String,
    email: String,
    copyright: String
}, {
    timestamps: true
});
exports.settingsModel = mongoose_1.default.model("Setting", settingSchema, "settings");
