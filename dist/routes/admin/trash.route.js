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
exports.trashRoute = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller = __importStar(require("../../controller/admin/trash.controller"));
router.get("/products", controller.indexProduct);
router.patch("/products/restore/:id", controller.restoreProduct);
router.delete("/products/permanently-deleted/:id", controller.permanentlyDeletedProduct);
router.patch("/products/change-many-item", controller.changeManyItemProduct);
router.get("/role", controller.indexRole);
router.patch("/roles/restore/:id", controller.restorePatch);
router.get("/topics", controller.indexTopics);
router.patch("/topics/restore/:id", controller.restoreTopic);
router.get("/singers", controller.indexSingers);
router.patch("/singers/restore/:id", controller.restoreSingers);
router.get("/users", controller.indexUsers);
router.patch("/users/restore/:id", controller.restoreUsers);
router.get("/account", controller.indexAccount);
router.patch("/account/restore/:id", controller.restoreAccPatch);
exports.trashRoute = router;
