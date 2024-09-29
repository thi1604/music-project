import { Request, Response } from "express";
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