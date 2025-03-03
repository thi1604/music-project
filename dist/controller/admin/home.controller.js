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
const get_data_to_DBoard_helper_1 = require("../../helper/get-data-to-DBoard.helper");
const account_model_1 = require("../../models/account.model");
const singer_model_1 = require("../../models/singer.model");
const song_model_1 = require("../../models/song.model");
const topics_model_1 = require("../../models/topics.model");
const user_model_1 = require("../../models/user.model");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statistic = {
        categoryProduct: yield (0, get_data_to_DBoard_helper_1.countData)(topics_model_1.topicModel),
        product: yield (0, get_data_to_DBoard_helper_1.countData)(song_model_1.songModel),
        account: yield (0, get_data_to_DBoard_helper_1.countData)(account_model_1.accountModel),
        user: yield (0, get_data_to_DBoard_helper_1.countData)(user_model_1.userModel),
        singer: yield (0, get_data_to_DBoard_helper_1.countData)(singer_model_1.singerModel)
    };
    res.render("admin/pages/home/index.pug", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
});
exports.index = index;
