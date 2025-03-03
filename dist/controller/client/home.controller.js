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
exports.index = void 0;
const singer_model_1 = require("../../models/singer.model");
const topics_model_1 = require("../../models/topics.model");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        outStanding: true,
        deleted: false,
        status: "active"
    };
    const listSingesrOS = yield singer_model_1.singerModel.find(filter);
    const listTopicsOS = yield topics_model_1.topicModel.find(filter);
    res.json({
        listSingesrOS: listSingesrOS,
        listTopicsOS: listTopicsOS
    });
});
exports.index = index;
