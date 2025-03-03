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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.loginPost = exports.login = void 0;
const system_1 = require("../../config/system");
const md5_1 = __importDefault(require("md5"));
const account_model_1 = require("../../models/account.model");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Trang đăng nhập"
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const record = yield account_model_1.accountModel.findOne({
        email: email
    });
    if (!record) {
        req.flash("error", "Tài khoản hoặc mật khẩu không chính xác!");
        res.redirect(`/${system_1.prefixAdmin}/auth/login`);
        return;
    }
    if ((0, md5_1.default)(password) != record.password) {
        req.flash("error", "Mật khẩu không chính xác!");
        res.redirect(`/${system_1.prefixAdmin}/auth/login`);
        return;
    }
    req.flash("success", "Đăng nhập thành công!");
    res.cookie("token", record.token);
    res.redirect(`/${system_1.prefixAdmin}/dashboard`);
});
exports.loginPost = loginPost;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.redirect(`/${system_1.prefixAdmin}/auth/login`);
});
exports.logOut = logOut;
