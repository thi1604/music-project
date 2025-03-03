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
exports.authMiddleware = void 0;
const system_1 = require("../../config/system");
const account_model_1 = require("../../models/account.model");
const roles_model_1 = require("../../models/roles.model");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.token == "") {
        res.redirect(`/${system_1.prefixAdmin}/auth/login`);
        return;
    }
    const account = yield account_model_1.accountModel.findOne({
        token: req.cookies.token,
        deleted: false
    }).select("fullName email phone avatar status role_id");
    if (!account) {
        res.redirect(`/${system_1.prefixAdmin}/auth/login`);
        return;
    }
    const role = yield roles_model_1.rolesModel.findOne({
        _id: account.role_id
    }).select("permissions title");
    res.locals.account = account;
    res.locals.role = role;
    next();
});
exports.authMiddleware = authMiddleware;
