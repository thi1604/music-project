"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roleSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    idPersonCreated: String,
    idPersonUpdated: String,
    idPersonDeleted: String,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const role = mongoose_1.default.model("roleSchema", roleSchema, "roles");
exports.rolesModel = role;
