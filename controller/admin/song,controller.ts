import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";

export const index = async (req:Request, res: Response) => {
  const songs = await songModel.find({
    status: "active",
    deleted: false
  });

  res.render("admin/pages/songs/index.pug", {
    pageTitle: "Quản lí bài hát",
    songs: songs
  });
};


export const create = async (req:Request, res: Response) => {
  const topics = await topicModel.find({
    status: "active",
    deleted: false
  }).select("title"); //Truong id tu dong lay ra


  const singer = await singerModel.find({
    status: "active",
    deleted: false
  }).select("fullName");

  res.render("admin/pages/songs/create.pug", {
    pageTitle: "Tạo mới bài hát",
    topics: topics,
    singers: singer
  });
};

export const createPost = async (req:Request, res: Response) => {
  if(req.body.audio){
    if(req.body.avatar){
      req.body.avatar = req.body.avatar[0];
    }
    req.body.audio = req.body.audio[0];
    const newSong = new songModel(req.body);
    await newSong.save();
    req.flash("success", "Tạo mới thành công!");
  }
  else{
    req.flash("error", "Chưa có file âm thanh!");
  }
  res.redirect(`/${prefixAdmin}/songs/create`);
};