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
exports.deleteItem = exports.changeManyStatus = exports.changeStatus = exports.editPatch = exports.edit = exports.detail = exports.index = void 0;
const system_1 = require("../../config/system");
const pagination_helper_1 = require("../../helper/pagination.helper");
const user_model_1 = require("../../models/user.model");
const md5_1 = __importDefault(require("md5"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: false
    };
    if (req.query.status) {
        filter["status"] = req.query["status"];
    }
    let keyword = req.query["keyword"];
    if (req.query["keyword"]) {
        const regex = new RegExp(keyword, "i");
        filter["fullName"] = regex;
        keyword = req.query.keyword;
    }
    const listFilter = [
        {
            label: "Tất cả",
            status: ""
        },
        {
            label: "Hoạt động",
            status: "active"
        },
        {
            label: "Dừng hoạt động",
            status: "inactive"
        }
    ];
    const listActions = [
        {
            label: "Hoạt động",
            status: "active"
        },
        {
            label: "Dừng hoạt động",
            status: "inactive"
        },
        {
            label: "Xóa",
            status: "delete"
        }
    ];
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, user_model_1.userModel);
    const users = yield user_model_1.userModel.find(filter)
        .limit(pagination.limitItems)
        .skip(pagination.skip);
    res.render("admin/pages/users/index.pug", {
        pageTitle: "Quản lí người dùng",
        users: users,
        pagination: pagination,
        keyword: keyword,
        listFilter: listFilter,
        listActions: listActions,
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield user_model_1.userModel.findOne({
            _id: id
        });
        res.render(`${system_1.prefixAdmin}/pages/users/detail.pug`, {
            pageTitle: "Chi tiết người dùng",
            product: item
        });
    }
    catch (error) {
        res.send("403");
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield user_model_1.userModel.findOne({
            _id: id
        });
        res.render("admin/pages/users/edit.pug", {
            pageTitle: "Trang chỉnh sửa user",
            product: item
        });
    }
    catch (_a) {
        res.redirect(`/${system_1.prefixAdmin}/users`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_edit")) {
        const id = req.params.id;
        try {
            const user = yield user_model_1.userModel.findOne({
                _id: id
            });
            if (req.body.password == "") {
                if (user) {
                    req.body.password = user.password;
                }
            }
            else {
                req.body.password = (0, md5_1.default)(req.body.password);
            }
            delete req.body.email;
            yield user_model_1.userModel.updateOne({
                _id: id
            }, req.body);
            req.flash('success', 'Đã cập nhật!');
            res.redirect(`/${system_1.prefixAdmin}/users/edit/${id}`);
        }
        catch (error) {
            req.flash('error', 'Lỗi!');
            res.redirect(`/${system_1.prefixAdmin}/users/edit/${id}`);
        }
    }
    else {
        res.send("403");
    }
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_edit")) {
        try {
            const { id, status } = req.params;
            yield user_model_1.userModel.updateOne({
                _id: id
            }, {
                status: status
            });
            req.flash('success', 'Cập nhật thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.prefixAdmin}/users`);
        }
    }
    else {
        res.send("403");
    }
});
exports.changeStatus = changeStatus;
const changeManyStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_edit")) {
        const { ids, status } = req.body;
        try {
            if (status == "delete") {
                yield user_model_1.userModel.updateMany({
                    _id: ids
                }, {
                    deleted: true
                });
            }
            else {
                yield user_model_1.userModel.updateMany({
                    _id: ids
                }, {
                    status: status
                });
            }
            req.flash('success', 'Cập nhật thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`/${system_1.prefixAdmin}/users`);
        }
    }
    else {
        res.send("403");
    }
});
exports.changeManyStatus = changeManyStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("users_delete")) {
        try {
            const id = req.params.id;
            yield user_model_1.userModel.updateOne({
                _id: id
            }, {
                deleted: true,
                idPersonDeleted: res.locals.account.id
            });
            req.flash('success', 'Xoá thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.redirect(`${system_1.prefixAdmin}/users`);
        }
    }
    else {
        res.send("403");
    }
});
exports.deleteItem = deleteItem;
