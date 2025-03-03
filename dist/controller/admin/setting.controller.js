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
exports.generalPost = exports.general = void 0;
const system_1 = require("../../config/system");
const setting_model_1 = require("../../models/setting.model");
const general = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield setting_model_1.settingsModel.findOne({});
    res.render("admin/pages/setting/general.pug", {
        pageTitle: "Cài đặt chung",
        setting: data
    });
});
exports.general = general;
const generalPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("setting_edit")) {
        try {
            const data = yield setting_model_1.settingsModel.findOne({});
            if (data) {
                yield setting_model_1.settingsModel.updateOne({
                    _id: data.id
                }, req.body);
            }
            else {
                const newData = new setting_model_1.settingsModel(req.body);
                yield newData.save();
            }
            req.flash("success", "Cập nhật thành công!");
            res.redirect(`/${system_1.prefixAdmin}/settings/general`);
        }
        catch (error) {
            res.send("403");
        }
    }
    else {
        res.send("403");
    }
});
exports.generalPost = generalPost;
