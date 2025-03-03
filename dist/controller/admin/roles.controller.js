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
exports.deleteItem = exports.detail = exports.permissionsPatch = exports.permissions = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const system_1 = require("../../config/system");
const pagination_helper_1 = require("../../helper/pagination.helper");
const roles_model_1 = require("../../models/roles.model");
const moment_1 = __importDefault(require("moment"));
const account_model_1 = require("../../models/account.model");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: false
    };
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, roles_model_1.rolesModel);
    const records = yield roles_model_1.rolesModel.find({ deleted: false })
        .skip(pagination.skip)
        .limit(pagination.limitItems);
    res.render(`${system_1.prefixAdmin}/pages/roles/index.pug`, {
        pageTitle: "Trang nhóm quyền",
        records: records,
        pagination: pagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render(`admin/pages/roles/create.pug`, {
        pageTitle: "Trang nhóm quyền",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_create")) {
        req.flash("success", "Tạo mới thành công!");
        req.body["idPersonCreated"] = res.locals.account.id;
        const newRecord = new roles_model_1.rolesModel(req.body);
        yield newRecord.save();
        res.redirect(`/${system_1.prefixAdmin}/roles`);
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const record = yield roles_model_1.rolesModel.findOne({
            _id: id
        });
        if (record) {
            res.render(`admin/pages/roles/edit.pug`, {
                pageTitle: "Chỉnh sửa nhóm quyền",
                record: record
            });
        }
        else {
            req.flash("error", "Lỗi!");
            res.redirect(`/${system_1.prefixAdmin}/roles`);
        }
    }
    catch (error) {
        req.flash("error", "Lỗi!");
        res.redirect(`/${system_1.prefixAdmin}/roles`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_edit")) {
        try {
            const id = req.params.id;
            req.body["idPersonUpdated"] = res.locals.account.id;
            yield roles_model_1.rolesModel.updateOne({
                _id: id
            }, req.body);
            req.flash("success", "Đã cập nhật!");
            res.redirect(`/${system_1.prefixAdmin}/roles`);
        }
        catch (error) {
            res.send("403");
        }
    }
    else {
        res.send("403");
    }
});
exports.editPatch = editPatch;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield roles_model_1.rolesModel.find({
        deleted: false
    });
    res.render("admin/pages/roles/permissions.pug", {
        pageTitle: "Trang phân quyền",
        records: records
    });
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_permissions")) {
        try {
            const roleAndPermissions = req.body.rolesArray;
            roleAndPermissions.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                yield roles_model_1.rolesModel.updateOne({
                    _id: item.id,
                }, {
                    permissions: item.permissions
                });
            }));
            res.json({
                code: 200
            });
        }
        catch (error) {
            res.send("403");
        }
    }
    else {
        res.send("403");
    }
});
exports.permissionsPatch = permissionsPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield roles_model_1.rolesModel.findOne({
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
        res.render(`admin/pages/roles/detail.pug`, {
            pageTitle: "Chi tiết nhóm quyền",
            product: item
        });
    }
    catch (error) {
        res.send("403");
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("roles_delete")) {
        try {
            const id = req.params.id;
            yield roles_model_1.rolesModel.updateOne({
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
            res.redirect(`${system_1.prefixAdmin}/roles`);
        }
    }
    else {
        res.send("403");
    }
});
exports.deleteItem = deleteItem;
