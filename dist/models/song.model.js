"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.songModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const songSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    avatar: String,
    topicId: String,
    singerIds: Array,
    like: Number,
    lyrics: String,
    listenNumber: {
        type: Number,
        default: 1
    },
    audio: String,
    status: String,
    totalTime: String,
    idPersonCreated: String,
    idPersonUpdated: String,
    idPersonDeleted: String,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
}, {
    timestamps: true
});
exports.songModel = mongoose_1.default.model("song", songSchema, "songs");
