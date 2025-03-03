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
exports.deleteItem = exports.changeStatus = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const system_1 = require("../../config/system");
const pagination_helper_1 = require("../../helper/pagination.helper");
const md5_1 = __importDefault(require("md5"));
const account_model_1 = require("../../models/account.model");
const roles_model_1 = require("../../models/roles.model");
const generate_helper_1 = require("../../helper/generate.helper");
const moment_1 = __importDefault(require("moment"));
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
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, account_model_1.accountModel);
    const account = yield account_model_1.accountModel.find(filter)
        .limit(pagination.limitItems)
        .skip(pagination.skip);
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Quản lí admin",
        accounts: account,
        pagination: pagination,
        keyword: keyword,
        listFilter: listFilter,
        listActions: listActions,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield roles_model_1.rolesModel.find({
        deleted: false
    }).select("title");
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Trang tạo mới tài khoản admin",
        roles: roles
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_create")) {
        try {
            req.body.password = (0, md5_1.default)(req.body.password);
            const token = (0, generate_helper_1.generateRandomString)(30);
            req.body.token = token;
            const role = yield roles_model_1.rolesModel.findOne({
                _id: req.body.role_id,
                deleted: false
            }).select("title");
            req.body.roleName = role.title;
            req.body["idPersonCreated"] = res.locals.account.id;
            const newAccount = new account_model_1.accountModel(req.body);
            yield newAccount.save();
            req.flash("success", "Tạo thành công!");
            res.redirect(`/${system_1.prefixAdmin}/accounts`);
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const Account = yield account_model_1.accountModel.findOne({
            _id: id
        });
        if (Account) {
            const roles = yield roles_model_1.rolesModel.find({
                deleted: false
            });
            res.render("admin/pages/accounts/edit.pug", {
                pageTitle: "Chỉnh sửa tài khoản",
                Account: Account,
                roles: roles
            });
        }
        else {
            req.flash("error", "Lỗi!");
            res.redirect(`/${system_1.prefixAdmin}/accounts`);
        }
    }
    catch (error) {
        req.flash("error", "Lỗi!");
        res.redirect(`/${system_1.prefixAdmin}/accounts`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        try {
            const id = req.params.id;
            const existAdmin = yield account_model_1.accountModel.findOne({
                email: req.body.email,
                _id: { $ne: id }
            });
            if (existAdmin) {
                req.flash("error", "Email đã tồn tại!");
                res.redirect(`/${system_1.prefixAdmin}/accounts/edit/${id}`);
            }
            else {
                if (req.body.password == "") {
                    delete req.body.password;
                }
                else
                    req.body.password = (0, md5_1.default)(req.body.password);
                req.body["idPersonUpdated"] = res.locals.account.id;
                yield account_model_1.accountModel.updateOne({
                    _id: id
                }, req.body);
                req.flash("success", "Cập nhật thành công!");
                res.redirect(`/${system_1.prefixAdmin}/accounts/edit/${id}`);
            }
        }
        catch (error) {
            req.flash("error", "Lỗi!");
            res.redirect(`/${system_1.prefixAdmin}/accounts`);
        }
    }
    else {
        res.send("403");
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield account_model_1.accountModel.findOne({
            _id: id
        });
        item["formatCreatedAt"] = (0, moment_1.default)(item.createdAt).format("HH:mm:ss DD/MM/YY");
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("HH:mm:ss DD/MM/YY");
        const accountCreated = yield account_model_1.accountModel.findOne({
            _id: item.idPersonCreated
        }).select("fullName");
        const accountUpdated = yield account_model_1.accountModel.findOne({
            _id: item.idPersonUpdated
        }).select("fullName");
        if (accountUpdated) {
            item["namePersonUpdated"] = accountUpdated.fullName;
        }
        if (accountCreated) {
            item["namePersonCreated"] = accountCreated.fullName;
        }
        res.render(`admin/pages/accounts/detail.pug`, {
            pageTitle: "Chi tiết tài khoản",
            product: item
        });
    }
    catch (error) {
        res.redirect(`${system_1.prefixAdmin}`);
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_edit")) {
        const { id, status } = req.params;
        try {
            const admin = yield account_model_1.accountModel.findOne({
                _id: id
            });
            if (admin && (status == "active" || status == "inactive")) {
                yield account_model_1.accountModel.updateOne({
                    _id: id
                }, {
                    status: status
                });
                req.flash("success", "Cập nhật thành công!");
            }
            else {
                req.flash("error", "Lỗi!");
            }
        }
        catch (error) {
            req.flash("error", "Lỗi!");
        }
        res.json({
            code: 200
        });
    }
    else {
        res.json({ code: 403 });
    }
});
exports.changeStatus = changeStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("accounts_delete")) {
        try {
            const id = req.params.id;
            yield account_model_1.accountModel.updateOne({
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
            res.redirect(`${system_1.prefixAdmin}/songs`);
        }
    }
    else {
        res.send("403");
    }
});
exports.deleteItem = deleteItem;
