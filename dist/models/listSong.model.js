"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSongsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const listSongsSchema = new mongoose_1.default.Schema({
    userId: String,
    songIds: Array
}, {
    timestamps: true
});
exports.listSongsModel = mongoose_1.default.model("listSongs", listSongsSchema, "list-songs");
