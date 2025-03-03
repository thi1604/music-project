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
exports.Password = exports.resetPasswordPatch = exports.resetPassword = exports.checkOtpPost = exports.checkOtp = exports.forgotPasswordPost = exports.forgotPassword = exports.logout = exports.changePasswordCheckOtpPatch = exports.changePasswordCheckOtp = exports.changeInfo = exports.changePasswordPatch = exports.changePassword = exports.detailUser = exports.loginPost = exports.registerPost = exports.authenToken = void 0;
const forgot_password_model_1 = require("../../models/forgot-password.model");
const user_model_1 = require("../../models/user.model");
const md5_1 = __importDefault(require("md5"));
const generate_helper_1 = require("../../helper/generate.helper");
const sendEmail_helper_1 = require("../../helper/sendEmail.helper");
const checkOTP_model_1 = require("../../models/checkOTP.model");
const love_song_model_1 = require("../../models/love-song.model");
const authenToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenCurrent = req.body.value;
    const user = yield user_model_1.userModel.findOne({
        tokenUser: tokenCurrent,
        deleted: false,
        status: "active"
    }).select("-email -password");
    if (user) {
        res.json({
            code: 200,
            messages: "token hop le!"
        });
    }
    else {
        res.json({
            code: 400,
            messages: "token khong hop le!"
        });
    }
});
exports.authenToken = authenToken;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName || !req.body.email || !req.body.password || !req.body.authenPass) {
        res.json({
            code: 400,
            messages: "Thiếu các trường thông tin bắt buộc",
            flag: 0
        });
        return;
    }
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const check = regexEmail.test(req.body.email);
    if (!check) {
        res.json({
            code: 400,
            messages: "Email không đúng định dạng",
            flag: 1
        });
        return;
    }
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;
    const checkPass = regexPass.test(req.body.password);
    if (!checkPass) {
        res.json({
            code: 400,
            messages: "Mật khẩu không đúng định dạng!",
            flag: 2
        });
        return;
    }
    else if (req.body.password != req.body.authenPass) {
        res.json({
            code: 400,
            messages: "Mật khẩu không trùng khớp!",
            flag: 3
        });
        return;
    }
    const existUser = yield user_model_1.userModel.findOne({
        email: req.body.email
    });
    if (existUser) {
        res.json({
            code: 400,
            messages: "Email đã được đăng kí!",
            flag: 4
        });
        return;
    }
    const tokenUser = (0, generate_helper_1.generateRandomString)(30);
    req.body.tokenUser = tokenUser;
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = new user_model_1.userModel(req.body);
    yield user.save();
    const otp = new checkOTP_model_1.checkOTPSModel({
        userId: user.id
    });
    yield otp.save();
    res.json({
        code: 200,
        token: tokenUser,
        messages: "Đăng kí thành công!"
    });
});
exports.registerPost = registerPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailCurrent = req.body.email;
    const user = yield user_model_1.userModel.findOne({
        email: emailCurrent
    });
    if (!user) {
        res.json({
            code: 400,
            messages: "Sai thông tin email!",
            flag: 1
        });
        return;
    }
    const password = req.body.password;
    if ((0, md5_1.default)(password) != user.password) {
        res.json({
            code: 400,
            messages: "Sai mật khẩu!",
            flag: 2
        });
        return;
    }
    if (user.status == "inactive" || user.deleted == true) {
        res.json({
            code: 400,
            messages: "Tài khoản đã khóa hoặc đã xóa!",
            flag: 3
        });
        return;
    }
    res.json({
        code: 200,
        messages: "Đăng nhập thành công!",
        flag: 4,
        token: user.tokenUser
    });
});
exports.loginPost = loginPost;
const detailUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findOne({
        tokenUser: req.body.tokenUser,
        deleted: false,
        status: "active"
    }).select("-password");
    if (user) {
        const numberLoveSong = yield love_song_model_1.loveSongModel.find({
            userId: user.id
        });
        const dataUser = {
            fullName: user.fullName,
            email: user.email,
            tokenUser: user.tokenUser,
            avatar: user.avatar,
            numberLoveSong: numberLoveSong.length
        };
        res.json({
            code: 200,
            user: dataUser
        });
    }
    else {
        res.json({
            code: 400,
            messages: "Không tồn tại user!"
        });
    }
});
exports.detailUser = detailUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.tokenUser) {
        res.render("client/pages/profile/change-password.pug", {
            pageTitle: "Đổi mật khẩu"
        });
    }
    else {
        res.redirect("/user/login");
    }
});
exports.changePassword = changePassword;
let dataChangePassword = {
    passwordOld: String,
    passwordNew: String,
    passwordNewAgain: String
};
const changePasswordPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.tokenUser) {
        const dataChangePassword = { passwordOld: String, passwordNew: String, passwordNewAgain: String } = req.body;
        if (dataChangePassword.passwordNew == "") {
            req.flash("error", "Lỗi!");
            res.redirect("/");
            return;
        }
        const user = res.locals.user;
        if (dataChangePassword.passwordNew != dataChangePassword.passwordNewAgain) {
            req.flash("error", "Mật khẩu mới không khớp!");
            res.redirect("back");
        }
        else if ((0, md5_1.default)(dataChangePassword.passwordOld) != user.password) {
            req.flash("error", "Mật khẩu cũ không chính xác!");
            res.redirect("back");
        }
        else {
            const otp = (0, generate_helper_1.generateRandomNumber)(6);
            (0, sendEmail_helper_1.sendEmail)(user.email, "Mã OTP THAY ĐỔI MẬT KHẨU.", `Mã xác thực của bạn là <b style ="color: green">${otp}</b>, có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã cho bất kì ai.`);
            const dataEmail = {
                email: user.email,
                otp: otp,
                expireAt: Date.now() + 3 * 60 * 1000
            };
            const data = new forgot_password_model_1.forgotPasswordModel(dataEmail);
            yield data.save();
            res.redirect("/user/change-password/check-otp");
        }
    }
    else {
        res.redirect("/user/login");
    }
});
exports.changePasswordPatch = changePasswordPatch;
const changeInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const dataChange = req.body.dataChange;
    if ((type == "email" || type == "text") && dataChange) {
        if (type == "email") {
            const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            const check = regexEmail.test(dataChange);
            if (!check) {
                res.send({
                    code: 400,
                    messages: "Email không đúng định dạng"
                });
            }
            else {
                const existUser = yield user_model_1.userModel.findOne({
                    tokenUser: req.body.tokenUser
                });
                if (existUser) {
                    res.send({
                        code: 400,
                        messages: "Email này đã được đăng kí!"
                    });
                }
                else {
                    yield user_model_1.userModel.updateOne({
                        tokenUser: req.body.tokenUser
                    }, {
                        email: dataChange
                    });
                    res.send({
                        code: 200,
                        messages: "Cập nhật thành công!"
                    });
                }
            }
        }
        else {
            yield user_model_1.userModel.updateOne({
                tokenUser: req.body.tokenUser
            }, {
                fullName: dataChange
            });
            res.send({
                code: 200,
                messages: "Cập nhật thành công!"
            });
        }
    }
    else {
        res.send({
            code: 400,
            messages: "Lỗi"
        });
    }
});
exports.changeInfo = changeInfo;
const changePasswordCheckOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.tokenUser) {
        res.render("client/pages/profile/check-otp.pug", {
            pageTitle: "Xác thực otp"
        });
    }
    else {
        res.redirect("/user/login");
    }
});
exports.changePasswordCheckOtp = changePasswordCheckOtp;
const changePasswordCheckOtpPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    if (req.cookies.tokenUser) {
        try {
            yield user_model_1.userModel.updateOne({
                _id: user.id
            }, {
                password: (0, md5_1.default)(dataChangePassword["passwordNew"])
            });
            req.flash("success", "Đổi mật khẩu thành công!");
            res.redirect(`/user/detail/${user.id}`);
        }
        catch (error) {
            req.flash("error", "Lỗi!");
            res.redirect("/");
        }
    }
    else {
        res.redirect("/user/login");
    }
});
exports.changePasswordCheckOtpPatch = changePasswordCheckOtpPatch;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Lấy lại mật khẩu"
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailCurrent = yield user_model_1.userModel.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!emailCurrent) {
        res.json({
            code: 400,
            messages: "Email không tồn tại trong hệ thống!"
        });
        return;
    }
    const otp = (0, generate_helper_1.generateRandomNumber)(6);
    (0, sendEmail_helper_1.sendEmail)(emailCurrent.email, "Mã OTP LẤY LẠI MẬT KHẨU.", `Mã xác thực của bạn là <b style ="color: green">${otp}</b>, có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã cho bất kì ai.`);
    const dataEmail = {
        email: emailCurrent.email,
        otp: otp,
        expireAt: Date.now() + 3 * 60 * 1000
    };
    const data = new forgot_password_model_1.forgotPasswordModel(dataEmail);
    yield data.save();
    const idUser = yield user_model_1.userModel.findOne({
        email: dataEmail.email
    }).select("id");
    res.json({
        code: 200,
        idUser: idUser.id,
        email: emailCurrent.email
    });
});
exports.forgotPasswordPost = forgotPasswordPost;
const checkOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    res.render("client/pages/user/check-otp.pug", {
        pageTitle: "Check otp",
        email: email
    });
});
exports.checkOtp = checkOtp;
let emailAuthen = "";
const checkOtpPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!otp || !email) {
        res.json({
            code: 400,
            messages: "Thiếu thông tin dữ liệu!",
            flag: 0
        });
        return;
    }
    const otpReal = yield forgot_password_model_1.forgotPasswordModel.findOne({
        email: email,
        otp: otp
    });
    if (!otpReal) {
        res.json({
            code: 400,
            messages: "Mã otp không chính xác!",
            flag: 1
        });
        return;
    }
    emailAuthen = email;
    const user = yield user_model_1.userModel.findOne({
        email: email,
        status: "active",
        deleted: false
    });
    yield checkOTP_model_1.checkOTPSModel.updateOne({ userId: user.id }, { isGetOTP: true });
    res.json({
        code: 200,
        messages: "Mã OTP hợp lệ!"
    });
});
exports.checkOtpPost = checkOtpPost;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Tạo lại mật khẩu mới"
    });
});
exports.resetPassword = resetPassword;
const resetPasswordPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.idUser || !req.body.password || !req.body.email || !req.body.passwordAuthen) {
        res.json({
            code: 400,
            messages: "Thiếu dữ liệu!",
            flag: 0
        });
        return;
    }
    try {
        const checkUserIsGetOtp = yield checkOTP_model_1.checkOTPSModel.findOne({
            userId: req.body.idUser,
            isGetOTP: true
        });
        if (req.body.password != req.body.passwordAuthen) {
            res.json({
                code: 400,
                messages: "Mật khẩu không trùng nhau!"
            });
            return;
        }
        if (!checkUserIsGetOtp) {
            res.json({
                code: 400,
                messages: "Lỗi!",
                flag: 3
            });
            return;
        }
        const regexPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;
        const check = regexPass.test(req.body.password);
        if (!check) {
            res.json({
                flag: 2,
                messages: "Mật khẩu không đúng định dạng!"
            });
            return;
        }
        const newPassword = (0, md5_1.default)(req.body.password);
        yield user_model_1.userModel.updateOne({
            _id: req.body.idUser,
        }, {
            password: newPassword
        });
        yield checkOTP_model_1.checkOTPSModel.updateOne({ userId: req.body.idUser }, { isGetOTP: false });
        const user = yield user_model_1.userModel.findOne({
            _id: req.body.idUser,
        }).select("tokenUser");
        emailAuthen = "";
        res.json({
            code: 200,
            token: user.tokenUser,
            messages: "Mật khẩu của bạn đã được đổi!"
        });
    }
    catch (error) {
        emailAuthen = req.body.email;
        res.json({
            code: 403,
            messages: "Lỗi!"
        });
    }
});
exports.resetPasswordPatch = resetPasswordPatch;
const Password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Tạo lại mật khẩu mới"
    });
});
exports.Password = Password;
