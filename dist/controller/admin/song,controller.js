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
exports.deleteItem = exports.changeManyStatus = exports.changeStatus = exports.createPost = exports.create = exports.editPatch = exports.edit = exports.detail = exports.index = void 0;
const system_1 = require("../../config/system");
const pagination_helper_1 = require("../../helper/pagination.helper");
const singer_model_1 = require("../../models/singer.model");
const song_model_1 = require("../../models/song.model");
const topics_model_1 = require("../../models/topics.model");
const moment_1 = __importDefault(require("moment"));
const account_model_1 = require("../../models/account.model");
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
    const pagination = yield (0, pagination_helper_1.Pagination)(req, filter, song_model_1.songModel);
    const songs = yield song_model_1.songModel.find(filter)
        .limit(pagination.limitItems)
        .skip(pagination.skip);
    res.render("admin/pages/songs/index.pug", {
        pageTitle: "Quản lí bài hát",
        songs: songs,
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
        const item = yield song_model_1.songModel.findOne({
            _id: id
        });
        item["formatCreatedAt"] = (0, moment_1.default)(item.createdAt).format("HH:mm:ss DD/MM/YY");
        item["formatUpdatedAt"] = (0, moment_1.default)(item.updatedAt).format("HH:mm:ss DD/MM/YY");
        const account = yield account_model_1.accountModel.findOne({
            _id: item.idPersonCreated
        }).select("fullName");
        const accountUpdated = yield account_model_1.accountModel.findOne({
            _id: item.idPersonUpdated
        }).select("fullName");
        if (accountUpdated) {
            item["namePersonUpdated"] = accountUpdated.fullName;
        }
        if (account) {
            item["namePersonCreated"] = account.fullName;
        }
        res.render(`${system_1.prefixAdmin}/pages/songs/detail.pug`, {
            pageTitle: "Chi tiết sản phẩm",
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
        const item = yield song_model_1.songModel.findOne({
            _id: id
        });
        const listTopics = yield topics_model_1.topicModel.find({
            deleted: false,
            status: "active"
        });
        const listSingers = yield singer_model_1.singerModel.find({
            deleted: false,
            status: "active"
        });
        res.render("admin/pages/songs/edit.pug", {
            pageTitle: "Trang chỉnh sửa bài hát",
            product: item,
            listTopics: listTopics,
            singers: listSingers
        });
    }
    catch (_a) {
        res.redirect(`/${system_1.prefixAdmin}/songs`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_edit")) {
        const id = req.params.id;
        req.body.listenNumber = parseInt(req.body.listenNumber);
        const idUpdated = res.locals.account.id;
        req.body.idPersonUpdated = idUpdated;
        try {
            yield song_model_1.songModel.updateOne({
                _id: id
            }, req.body);
            req.flash('success', 'Đã cập nhật!');
            res.redirect(`/${system_1.prefixAdmin}/songs/edit/${id}`);
        }
        catch (error) {
            req.flash('error', 'Lỗi!');
            res.redirect(`/${system_1.prefixAdmin}/songs/edit/${id}`);
        }
    }
    else {
        res.send("403");
    }
});
exports.editPatch = editPatch;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topics_model_1.topicModel.find({
        status: "active",
        deleted: false
    }).select("title");
    const singer = yield singer_model_1.singerModel.find({
        status: "active",
        deleted: false
    }).select("fullName");
    res.render("admin/pages/songs/create.pug", {
        pageTitle: "Tạo mới bài hát",
        topics: topics,
        singers: singer
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_create")) {
        const totalSecond = parseFloat(req.body["duration"]);
        const minutes = Math.floor(totalSecond / 60);
        const second = Math.floor(totalSecond % 60);
        const totalTime = `${String(minutes).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
        req.body["totalTime"] = totalTime;
        console.log(req.body);
        if (req.body.audio) {
            if (req.body.avatar) {
                req.body.avatar = req.body.avatar[0];
            }
            req.body.audio = req.body.audio[0];
            const newSong = new song_model_1.songModel(req.body);
            yield newSong.save();
            req.flash("success", "Tạo mới thành công!");
        }
        else {
            req.flash("error", "Chưa có file âm thanh!");
        }
        res.redirect(`/${system_1.prefixAdmin}/songs/create`);
    }
    else {
        res.send("403");
    }
});
exports.createPost = createPost;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_edit")) {
        try {
            const { id, status } = req.params;
            yield song_model_1.songModel.updateOne({
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
            res.redirect(`/${system_1.prefixAdmin}/product`);
        }
    }
    else {
        res.send("403");
    }
});
exports.changeStatus = changeStatus;
const changeManyStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_edit")) {
        const { ids, status } = req.body;
        try {
            if (status == "delete") {
                yield song_model_1.songModel.updateMany({
                    _id: ids
                }, {
                    deleted: true
                });
            }
            else {
                yield song_model_1.songModel.updateMany({
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
            res.redirect(`/${system_1.prefixAdmin}/songs`);
        }
    }
    else {
        res.send("403");
    }
});
exports.changeManyStatus = changeManyStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes("songs_delete")) {
        try {
            const id = req.params.id;
            yield song_model_1.songModel.updateOne({
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
