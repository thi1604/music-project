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
exports.deleteItem = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.changeStatus = exports.index = void 0;
const system_1 = require("../../config/system");
const pagination_helper_1 = require("../../helper/pagination.helper");
const topics_model_1 = require("../../models/topics.model");
const moment_1 = __importDefault(require("moment"));
const account_model_1 = require("../../models/account.model");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: false
    };
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, topics_model_1.topicModel);
    if (req.query.page == '0') {
        pagination.currentPage = 1;
    }
    const record = yield topics_model_1.topicModel
        .find({ deleted: false })
        .limit(pagination.limitItems)
        .skip(pagination.skip);
    res.render("admin/pages/topics/index.pug", {
        pageTitle: "Danh mục bài hát",
        listRecord: record,
        pagination: pagination
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs-category_edit")) {
        try {
            const { id, status } = req.params;
            yield topics_model_1.topicModel.updateOne({
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
            res.redirect(`/${system_1.prefixAdmin}/topics`);
        }
    }
    else {
        res.send("403");
    }
});
exports.changeStatus = changeStatus;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/topics/create.pug", {
        pageTitle: "Thêm mới danh mục sản phẩm"
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs-category_create")) {
        req.body["idPersonCreated"] = res.locals.account.id;
        const newTopics = new topics_model_1.topicModel(req.body);
        req.flash("success", "Thêm danh mục thành công !");
        yield newTopics.save();
        res.redirect(`/${system_1.prefixAdmin}/topics`);
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield topics_model_1.topicModel.findOne({
            _id: id
        });
        if (record) {
            res.render(`${system_1.prefixAdmin}/pages/topics/edit.pug`, {
                pageTitle: "Trang chỉnh sửa danh mục",
                product: record
            });
        }
        else {
            res.redirect(`/${system_1.prefixAdmin}/topics`);
        }
    }
    catch (error) {
        res.redirect(`/${system_1.prefixAdmin}/topics`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs-category_edit")) {
        const id = req.params.id;
        req.body["idPersonUpdated"] = res.locals.account.id;
        yield topics_model_1.topicModel.updateOne({
            _id: id
        }, req.body);
        req.flash("success", "Cập nhật thành công !");
        res.redirect(`/${system_1.prefixAdmin}/topics`);
    }
    else {
        res.send("403");
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield topics_model_1.topicModel.findOne({
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
            item["namePersonUpdated"] = accountCreated.fullName;
        }
        res.render(`${system_1.prefixAdmin}/pages/topics/detail.pug`, {
            pageTitle: "Chi tiết danh mục",
            product: item
        });
    }
    catch (error) {
        console.log("error");
    }
});
exports.detail = detail;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs-category_delete")) {
        try {
            const id = req.params.id;
            yield topics_model_1.topicModel.updateOne({
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
