import { Request, Response } from "express";
import { songModel } from "../../models/song.model";
import { singerModel } from "../../models/singer.model";
import { topicModel } from "../../models/topics.model";


export const index = async (req: Request, res: Response) =>{
  const listSongs = await songModel.find().select("-description");
  res.render("client/pages/songs/list.pug", {
    pageTitle: "Danh sách bài hát",
    listSongs: listSongs
  })
}

export const detail = async (req: Request, res: Response) => {
  const slugSong : string = req.params.slugSong;

  const song = await songModel.findOne({
    slug: slugSong,
    deleted: false
  });

  const singer = await singerModel.findOne({
    _id: song.singerId,
    deleted: false
  });

  const topic = await topicModel.findOne({
    _id: song.topicId,
    deleted: false
  });

  res.render("client/pages/songs/detail.pug", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    singer: singer,
    topic: topic
  });
}
