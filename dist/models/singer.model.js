"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const singerSchema = new mongoose_1.default.Schema({
    fullName: String,
    avatar: String,
    status: String,
    outStanding: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    idPersonCreated: String,
    idPersonUpdated: String,
    idPersonDeleted: String,
    description: String,
    slug: {
        type: String,
        slug: "fullName",
        unique: true
    }
}, {
    timestamps: true
});
exports.singerModel = mongoose_1.default.model("singer", singerSchema, "singer");
