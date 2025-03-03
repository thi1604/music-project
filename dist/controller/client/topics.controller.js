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
exports.songsInTopic = exports.index = void 0;
const singer_model_1 = require("../../models/singer.model");
const song_model_1 = require("../../models/song.model");
const topics_model_1 = require("../../models/topics.model");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {
        deleted: false,
        status: "active"
    };
    if (req.body.outStanding == true) {
        filter["outStanding"] = true;
    }
    const listTopics = yield topics_model_1.topicModel.find(filter);
    res.json(listTopics);
});
exports.index = index;
const songsInTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicCurrent = yield topics_model_1.topicModel.findOne({
        slug: req.params.slugTopic
    }).select("id title avatar description");
    let listSongs = [];
    let listSongsFinal = [];
    if (topicCurrent) {
        listSongs = yield song_model_1.songModel.find({
            topicId: topicCurrent.id,
            deleted: false,
            status: "active"
        });
    }
    if (listSongs.length > 0) {
        for (const item of listSongs) {
            try {
                const singers = yield singer_model_1.singerModel.find({
                    _id: { $in: item.singerIds },
                    deleted: false,
                    status: "active"
                }).select("fullName slug");
                const data = {
                    title: item.title,
                    avatar: item.avatar,
                    slug: item.slug,
                    singers: singers,
                    lyric: item.lyrics,
                    like: item.like,
                    totalTime: item.totalTime,
                    audio: item.audio,
                    listenNumber: item.listenNumber
                };
                listSongsFinal.push(data);
            }
            catch (error) {
                res.json("Error!");
            }
        }
    }
    res.json({
        topicCurrent: topicCurrent,
        listSongs: listSongsFinal
    });
});
exports.songsInTopic = songsInTopic;
