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
exports.countData = void 0;
const countData = (typeModel) => __awaiter(void 0, void 0, void 0, function* () {
    const record = {};
    record["total"] = yield typeModel.countDocuments({
        deleted: false
    });
    record["active"] = yield typeModel.countDocuments({
        status: "active",
        deleted: false
    });
    record["inactive"] = yield typeModel.countDocuments({
        status: "inactive",
        deleted: false
    });
    return record;
});
exports.countData = countData;
