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
exports.restoreAccPatch = exports.indexAccount = exports.restoreUsers = exports.indexUsers = exports.restoreSingers = exports.indexSingers = exports.restoreTopic = exports.indexTopics = exports.restorePatch = exports.indexRole = exports.changeManyItemProduct = exports.permanentlyDeletedProduct = exports.restoreProduct = exports.indexProduct = void 0;
const moment_1 = __importDefault(require("moment"));
const pagination_helper_1 = require("../../helper/pagination.helper");
const account_model_1 = require("../../models/account.model");
const roles_model_1 = require("../../models/roles.model");
const singer_model_1 = require("../../models/singer.model");
const song_model_1 = require("../../models/song.model");
const topics_model_1 = require("../../models/topics.model");
const user_model_1 = require("../../models/user.model");
const indexProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: true
    };
    if (req.query.status) {
        filter["status"] = req.query["status"];
    }
    let keyword = req.query["keyword"];
    if (req.query["keyword"]) {
        const regex = new RegExp(keyword, "i");
        filter["title"] = regex;
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
            label: "Khôi phục",
            status: "restore"
        },
        {
            label: "Xóa vĩnh viễn",
            status: "permanently-deleted"
        }
    ];
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, song_model_1.songModel);
    const listProducts = yield song_model_1.songModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for (const item of listProducts) {
        const namePersonDeleted = yield account_model_1.accountModel.findOne({
            _id: item.idPersonDeleted
        }).select("fullName");
        if (namePersonDeleted) {
            item["namePersonDeleted"] = namePersonDeleted.fullName;
        }
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    res.render("admin/pages/trash/products/index.pug", {
        pageTitle: "Trang thùng rác",
        listProducts: listProducts,
        pagination: pagination_helper_1.Pagination,
        listFilter: listFilter,
        listActions: listActions,
        keyword: keyword
    });
});
exports.indexProduct = indexProduct;
const restoreProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.role.permissions.includes("roles_permissions")) {
            const id = req.params.id;
            yield song_model_1.songModel.updateOne({
                _id: id
            }, {
                deleted: false
            });
            req.flash('success', 'Khôi phục thành công!');
            res.json({
                code: 200
            });
        }
        else
            res.send("403");
    }
    catch (error) {
        res.send("403");
    }
});
exports.restoreProduct = restoreProduct;
const permanentlyDeletedProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.role.permissions.includes("roles_permissions")) {
            const id = req.params.id;
            yield song_model_1.songModel.deleteOne({
                _id: id
            });
            req.flash('success', 'Xóa thành công!');
            res.json({
                code: 200
            });
        }
        else
            res.send("403");
    }
    catch (error) {
        res.send("403");
    }
});
exports.permanentlyDeletedProduct = permanentlyDeletedProduct;
const changeManyItemProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.role.permissions.includes("roles_permissions")) {
            const { ids, status } = req.body;
            if (status == "restore") {
                req.flash('success', 'Khôi phục thành công!');
                yield song_model_1.songModel.updateMany({
                    _id: ids
                }, {
                    deleted: false
                });
            }
            else {
                req.flash('success', 'Xóa thành công!');
                yield song_model_1.songModel.deleteMany({
                    _id: ids
                });
            }
            res.json({
                code: 200
            });
        }
        else
            res.send("403");
    }
    catch (error) {
        res.send("403");
    }
});
exports.changeManyItemProduct = changeManyItemProduct;
const indexRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: true
    };
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, roles_model_1.rolesModel);
    const listProducts = yield roles_model_1.rolesModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for (const item of listProducts) {
        const namePersonDeleted = yield account_model_1.accountModel.findOne({
            _id: item.idPersonDeleted
        }).select("fullName");
        if (namePersonDeleted) {
            item["namePersonDeleted"] = namePersonDeleted.fullName;
        }
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    res.render("admin/pages/trash/role/index.pug", {
        pageTitle: "Trang thùng rác",
        listProducts: listProducts,
        pagination: pagination_helper_1.Pagination
    });
});
exports.indexRole = indexRole;
const restorePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("trash_edit")) {
        try {
            const id = req.body.idRole;
            const item = roles_model_1.rolesModel.findOne({
                _id: id
            });
            if (!item) {
                req.flash("error", "Lỗi!");
            }
            else {
                const id = req.params.id;
                yield roles_model_1.rolesModel.updateOne({
                    _id: id
                }, {
                    deleted: false
                });
                req.flash('success', 'Khôi phục thành công!');
                res.json({
                    code: 200
                });
            }
        }
        catch (error) {
            req.flash("error", "Lỗi!");
        }
    }
    else {
        res.send("403");
    }
});
exports.restorePatch = restorePatch;
const indexTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: true
    };
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, topics_model_1.topicModel);
    const listProducts = yield topics_model_1.topicModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for (const item of listProducts) {
        const namePersonDeleted = yield account_model_1.accountModel.findOne({
            _id: item.idPersonDeleted
        }).select("fullName");
        if (namePersonDeleted) {
            item["namePersonDeleted"] = namePersonDeleted.fullName;
        }
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    res.render("admin/pages/trash/topic/index.pug", {
        pageTitle: "Trang thùng rác",
        listProducts: listProducts,
        pagination: pagination_helper_1.Pagination
    });
});
exports.indexTopics = indexTopics;
const restoreTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("trash_edit")) {
        try {
            const id = req.params.id;
            yield topics_model_1.topicModel.updateOne({
                _id: id
            }, {
                deleted: false
            });
            req.flash('success', 'Khôi phục thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            req.flash("error", "Lỗi!");
        }
    }
    else {
        res.send("403");
    }
});
exports.restoreTopic = restoreTopic;
const indexSingers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: true
    };
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, singer_model_1.singerModel);
    const listProducts = yield singer_model_1.singerModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for (const item of listProducts) {
        const namePersonDeleted = yield account_model_1.accountModel.findOne({
            _id: item.idPersonDeleted
        }).select("fullName");
        if (namePersonDeleted) {
            item["namePersonDeleted"] = namePersonDeleted.fullName;
        }
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    res.render("admin/pages/trash/singer/index.pug", {
        pageTitle: "Trang thùng rác",
        listProducts: listProducts,
        pagination: pagination_helper_1.Pagination
    });
});
exports.indexSingers = indexSingers;
const restoreSingers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("trash_edit")) {
        try {
            const id = req.params.id;
            yield singer_model_1.singerModel.updateOne({
                _id: id
            }, {
                deleted: false
            });
            req.flash('success', 'Khôi phục thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            req.flash("error", "Lỗi!");
        }
    }
    else {
        res.send("403");
    }
});
exports.restoreSingers = restoreSingers;
const indexUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: true
    };
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, user_model_1.userModel);
    const listProducts = yield user_model_1.userModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    res.render("admin/pages/trash/user/index.pug", {
        pageTitle: "Trang thùng rác",
        listProducts: listProducts,
        pagination: pagination_helper_1.Pagination
    });
});
exports.indexUsers = indexUsers;
const restoreUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("trash_edit")) {
        try {
            const id = req.params.id;
            yield user_model_1.userModel.updateOne({
                _id: id
            }, {
                deleted: false
            });
            req.flash('success', 'Khôi phục thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            req.flash("error", "Lỗi!");
        }
    }
    else {
        res.send("403");
    }
});
exports.restoreUsers = restoreUsers;
const indexAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        deleted: true
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
            label: "Khôi phục",
            status: "restore"
        },
        {
            label: "Xóa vĩnh viễn",
            status: "permanently-deleted"
        }
    ];
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, account_model_1.accountModel);
    const listProducts = yield account_model_1.accountModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for (const item of listProducts) {
        const namePersonDeleted = yield account_model_1.accountModel.findOne({
            _id: item.idPersonUpdated
        }).select("fullName");
        if (namePersonDeleted) {
            item["namePersonDeleted"] = namePersonDeleted.fullName;
        }
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
    res.render("admin/pages/trash/accounts/index.pug", {
        pageTitle: "Trang thùng rác",
        listProducts: listProducts,
        pagination: pagination,
        listFilter: listFilter,
        listActions: listActions,
        keyword: keyword
    });
});
exports.indexAccount = indexAccount;
const restoreAccPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("trash_edit")) {
        try {
            const id = req.params.id;
            yield account_model_1.accountModel.updateOne({
                _id: id
            }, {
                deleted: false
            });
            req.flash('success', 'Khôi phục thành công!');
            res.json({
                code: 200
            });
        }
        catch (error) {
            req.flash("error", "Lỗi!");
        }
    }
    else {
        res.send("403");
    }
});
exports.restoreAccPatch = restoreAccPatch;
