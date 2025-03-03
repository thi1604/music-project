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
exports.listenNumberPatch = exports.randomSongLogin = exports.randomSong = exports.search = exports.checkLoveSong = exports.love = exports.like = exports.loveSongs = exports.topSongs = exports.detail = void 0;
const song_model_1 = require("../../models/song.model");
const singer_model_1 = require("../../models/singer.model");
const like_song_model_1 = require("../../models/like-song.model");
const love_song_model_1 = require("../../models/love-song.model");
const unidecode_1 = __importDefault(require("unidecode"));
const user_model_1 = require("../../models/user.model");
const topics_model_1 = require("../../models/topics.model");
const listSong_model_1 = require("../../models/listSong.model");
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const song = yield song_model_1.songModel.findOne({
        slug: slugSong,
        deleted: false,
        status: "active"
    }).select("-status -deleted");
    let slugTopic;
    try {
        slugTopic = yield topics_model_1.topicModel.findOne({
            _id: song.topicId,
            deleted: false,
            status: "active"
        }).select("slug");
    }
    catch (error) {
        res.json({
            code: 400,
            messages: "Error!"
        });
        return;
    }
    if (!song) {
        res.json({
            code: 400,
            messages: "Bài hát không tồn tại trong hệ thống!"
        });
        return;
    }
    const singers = yield singer_model_1.singerModel.find({
        _id: { $in: song.singerIds },
        deleted: false,
        status: "active"
    }).select("fullName slug");
    res.json({
        songCurrent: song,
        singer: singers,
        topicSlug: slugTopic.slug
    });
});
exports.detail = detail;
const topSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listTopSongs = yield song_model_1.songModel
        .find({
        deleted: false,
        status: "active"
    }).sort({ listenNumber: "desc" })
        .limit(3)
        .select("title avatar singerIds slug listenNumber audio");
    const dataFinal = [];
    for (const item of listTopSongs) {
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
            audio: item.audio,
            listenNumber: item.listenNumber
        };
        dataFinal.push(data);
    }
    res.json({
        code: 200,
        dataFinal: dataFinal
    });
});
exports.topSongs = topSongs;
const loveSongs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const User = yield user_model_1.userModel.findOne({
        tokenUser: req["tokenUser"],
        status: "active",
        deleted: false
    }).select("tokenUser");
    let listSongIds = [];
    listSongIds = yield love_song_model_1.loveSongModel.find({
        userId: User.id
    });
    const songsResult = [];
    for (const item of listSongIds) {
        try {
            const song = yield song_model_1.songModel.findOne({
                _id: item.songId,
                deleted: false,
                status: "active"
            });
            if (song) {
                const singers = yield singer_model_1.singerModel.find({
                    _id: { $in: song.singerIds },
                    status: "active",
                    deleted: false
                }).select("fullName slug");
                const dataSong = {
                    title: song.title,
                    avatar: song.avatar,
                    totalTime: song.totalTime,
                    slug: song.slug,
                    singers: singers,
                    audio: song.audio,
                    lyrics: song.lyrics,
                    listenNumber: song.listenNumber,
                };
                songsResult.push(dataSong);
            }
        }
        catch (error) {
            res.json({
                code: 400,
                messages: "Error"
            });
        }
    }
    res.json({
        code: 200,
        listSongs: songsResult
    });
});
exports.loveSongs = loveSongs;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, type } = req.body;
        const song = yield song_model_1.songModel.findOne({
            _id: id
        }).select("like");
        let likeCurrent = song.like;
        if (likeCurrent >= 0) {
            if (type == "like") {
                likeCurrent += 1;
                const existLike = yield like_song_model_1.likeSongModel.findOne({
                    userId: res.locals.user.id,
                    songId: song.id
                });
                if (!existLike) {
                    const dataLike = new like_song_model_1.likeSongModel({
                        userId: res.locals.user.id,
                        songId: song.id,
                        deleted: false
                    });
                    yield dataLike.save();
                }
                else {
                    yield like_song_model_1.likeSongModel.updateOne({
                        userId: res.locals.user.id,
                        songId: song.id
                    }, {
                        deleted: false
                    });
                }
            }
            else {
                if (likeCurrent > 0)
                    likeCurrent -= 1;
                yield like_song_model_1.likeSongModel.updateOne({
                    userId: res.locals.user.id,
                    songId: song.id
                }, {
                    deleted: true
                });
            }
        }
        yield song_model_1.songModel.updateOne({
            _id: id
        }, {
            like: likeCurrent
        });
        res.json({
            code: 200,
            updateLike: likeCurrent
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.like = like;
const love = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenUser, slugSong } = req.body;
        const userCurrent = yield user_model_1.userModel.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: "active"
        }).select("-password");
        const songCurrent = yield song_model_1.songModel.findOne({
            slug: slugSong,
            deleted: false,
            status: "active"
        });
        const existLoveSong = yield love_song_model_1.loveSongModel.findOne({
            userId: userCurrent.id,
            songId: songCurrent.id
        });
        let status = "";
        if (existLoveSong) {
            yield love_song_model_1.loveSongModel.deleteOne({
                userId: userCurrent.id,
                songId: songCurrent.id
            });
            status = "noLove";
        }
        else {
            const data = new love_song_model_1.loveSongModel({
                userId: userCurrent.id,
                songId: songCurrent.id
            });
            yield data.save();
            status = "love";
        }
        res.json({
            code: 200,
            status: status
        });
    }
    catch (error) {
        res.json({
            code: 400,
            messages: "Error"
        });
    }
});
exports.love = love;
const checkLoveSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenUser, slugSong } = req.body;
        const userCurrent = yield user_model_1.userModel.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: "active"
        }).select("-password");
        const songCurrent = yield song_model_1.songModel.findOne({
            slug: slugSong,
            deleted: false,
            status: "active"
        });
        const checkLove = yield love_song_model_1.loveSongModel.findOne({
            userId: userCurrent.id,
            songId: songCurrent.id
        });
        if (checkLove) {
            res.json({
                code: 200
            });
        }
        else {
            res.json({
                code: 400
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            messages: "Error"
        });
    }
});
exports.checkLoveSong = checkLoveSong;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let keyword = `${req.params.keyword}`;
    let songs = [];
    let songsResult = [];
    if (keyword) {
        let keywordSlug = keyword;
        keywordSlug = keyword.trim();
        keywordSlug = keywordSlug.replace(/\s+/g, "-");
        keywordSlug = (0, unidecode_1.default)(keywordSlug);
        const regexKeyWord = new RegExp(keyword, "i");
        const regexKeyWordSlug = new RegExp(keywordSlug, "i");
        const singers = yield singer_model_1.singerModel.find({
            $or: [
                { fullName: regexKeyWord },
                { slug: regexKeyWordSlug }
            ],
            deleted: false,
            status: "active"
        }).select("id");
        const listsingersId = singers.map(item => item.id);
        songs = yield song_model_1.songModel.find({
            $or: [
                { title: regexKeyWord },
                { slug: regexKeyWordSlug },
                { singerIds: { $in: listsingersId } }
            ],
            deleted: false,
            status: "active"
        }).select("-deleted -status -updateAt");
        for (const item of songs) {
            const singers = yield singer_model_1.singerModel.find({
                _id: { $in: item.singerIds },
                status: "active",
                deleted: false
            }).select("fullName slug");
            const dataSong = {
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
            songsResult.push(dataSong);
        }
    }
    res.json(songsResult);
});
exports.search = search;
const randomSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugCurrent = req.body.slugSong;
    const listSongs = yield song_model_1.songModel.find({
        deleted: false,
        status: "active",
        slug: { $ne: slugCurrent }
    });
    const index = Math.floor(Math.random() * listSongs.length);
    const item = listSongs[index];
    const singers = yield singer_model_1.singerModel.find({
        _id: { $in: item.singerIds },
        status: "active",
        deleted: false
    }).select("fullName slug");
    const dataSong = {
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
    res.json({
        code: 200,
        songs: dataSong
    });
});
exports.randomSong = randomSong;
const randomSongLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.body.slugSong;
    const user = yield user_model_1.userModel.findOne({
        tokenUser: req.body.tokenUser,
        status: "active"
    }).select("fullName");
    const song = yield song_model_1.songModel.findOne({
        slug: slugSong
    }).select("title");
    if (song && user) {
        const data = {
            userId: user.id,
            songIds: song.id
        };
        const listSongCurrent = yield listSong_model_1.listSongsModel.findOne({
            userId: user.id
        });
        if (listSongCurrent) {
            yield listSong_model_1.listSongsModel.updateOne({ userId: user.id }, { $push: { songIds: song.id } });
        }
        else {
            const newListSongs = new listSong_model_1.listSongsModel(data);
            yield newListSongs.save();
        }
        res.json({
            code: 200,
            messages: "Lưu thành công!"
        });
    }
    else {
        res.json({
            code: 400,
            messages: "Lỗi!"
        });
    }
});
exports.randomSongLogin = randomSongLogin;
const listenNumberPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    try {
        const song = yield song_model_1.songModel.findOne({
            slug: slugSong
        }).select("listenNumber");
        if (song) {
            let listenNumberCurrent = song.listenNumber;
            listenNumberCurrent += 1;
            yield song_model_1.songModel.updateOne({
                slug: slugSong
            }, {
                "listenNumber": listenNumberCurrent
            });
            res.json({
                code: 200,
                messager: "Cập nhật thành công",
                newListen: listenNumberCurrent
            });
        }
        else {
            res.json({
                code: 400
            });
        }
    }
    catch (error) {
        res.json({
            code: 400
        });
    }
});
exports.listenNumberPatch = listenNumberPatch;
