"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const accountSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    token: String,
    avatar: String,
    role_id: String,
    roleName: String,
    idPersonCreated: String,
    idPersonUpdated: String,
    idPersonDeleted: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.accountModel = mongoose_1.default.model("account", accountSchema, "account");
