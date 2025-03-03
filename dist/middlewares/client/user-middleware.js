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
exports.infoUser = void 0;
const user_model_1 = require("../../models/user.model");
const infoUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenUser = req.body.tokenUser;
    if (tokenUser) {
        const user = yield user_model_1.userModel.findOne({
            tokenUser: tokenUser
        });
        if (user) {
            req["tokenUser"] = user.tokenUser;
            next();
        }
        else {
            res.json({
                code: 400,
                messages: "Token không chính xác!"
            });
            return;
        }
    }
    else {
        res.json({
            code: 400,
            messages: "Thiếu token!"
        });
        return;
    }
});
exports.infoUser = infoUser;
