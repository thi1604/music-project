"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFieldsToCloud = exports.uploadtoCloud = void 0;
const streamUpload_helper_1 = require("../../helper/streamUpload.helper");
const uploadtoCloud = (req, res, next) => {
    if (req["file"]) {
        const uploadtoCloud = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, streamUpload_helper_1.streamUpload)(buffer);
            req.body[req["file"].fieldname] = result["url"];
            next();
        });
        uploadtoCloud(req["file"].buffer);
    }
    else
        next();
};
exports.uploadtoCloud = uploadtoCloud;
const uploadFieldsToCloud = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req["files"]) {
        for (const item in req["files"]) {
            req.body[item] = [];
            for (const subItem of req["files"][item]) {
                const result = yield (0, streamUpload_helper_1.streamUpload)(subItem.buffer);
                req.body[item].push(result["url"]);
                req.body["duration"] = result["duration"];
            }
        }
        next();
    }
    else {
        next();
    }
});
exports.uploadFieldsToCloud = uploadFieldsToCloud;
