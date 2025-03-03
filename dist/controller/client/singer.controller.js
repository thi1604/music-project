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
exports.detail = exports.index = void 0;
const singer_model_1 = require("../../models/singer.model");
const song_model_1 = require("../../models/song.model");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {
        deleted: false,
        status: "active"
    };
    if (req.body.outStanding && req.body.outStanding == true) {
        filter["outStanding"] = true;
    }
    const listSinger = yield singer_model_1.singerModel.find(filter);
    res.json(listSinger);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singerCurrent = yield singer_model_1.singerModel.findOne({
        slug: req.params.slugSinger,
        deleted: false,
        status: "active"
    }).select("fullName avatar description slug");
    if (!singerCurrent) {
        res.json({
            code: 400,
            messsages: "Không tồn tại ca sĩ trong hệ thống!"
        });
        return;
    }
    const dataSongs = [];
    const SongsOfSinger = yield song_model_1.songModel.find({
        singerIds: { $in: [singerCurrent.id] },
        deleted: false,
        status: "active"
    }).select("slug like listenNumber totalTime avatar title singerIds audio lyrics");
    for (const item of SongsOfSinger) {
        const singers = [];
        for (const singerId of item.singerIds) {
            const singerCurrent = yield singer_model_1.singerModel.findOne({
                _id: singerId,
                deleted: false
            }).select("fullName slug");
            singers.push(singerCurrent);
        }
        let song = {
            title: item.title,
            avatar: item.avatar,
            totalTime: item.totalTime,
            listenNumber: item.listenNumber,
            like: item.like,
            slug: item.slug,
            singers: singers,
            audio: item.audio,
            lyrics: item.lyrics
        };
        dataSongs.push(song);
    }
    res.json({
        singer: singerCurrent,
        listSongs: dataSongs
    });
});
exports.detail = detail;
