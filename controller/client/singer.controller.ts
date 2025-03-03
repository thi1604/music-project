import { Request, Response } from "express";
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";

export const index = async (req: Request, res: Response) => {
  let filter = {
    deleted: false,
    status: "active"
  }

  if (req.body.outStanding && req.body.outStanding == true) {
    filter["outStanding"] = true;
  }

  const listSinger = await singerModel.find(filter);
  res.json(listSinger);
} 


export const detail = async (req: Request, res: Response) => {
  const singerCurrent = await singerModel.findOne({
    slug: req.params.slugSinger,
    deleted: false,
    status: "active"
  }).select("fullName avatar description slug");

  if(!singerCurrent){
    res.json({
      code: 400,
      messsages: "Không tồn tại ca sĩ trong hệ thống!"
    })
    return;
  }
  
  const dataSongs = [];

  const SongsOfSinger = await songModel.find({
    singerIds: {$in: [singerCurrent.id]},
    deleted: false,
    status: "active"
  }).select("slug like listenNumber totalTime avatar title singerIds audio lyrics");
  
  for (const item of SongsOfSinger) {
    const singers = [];
    for (const singerId of item.singerIds) {
      const singerCurrent = await singerModel.findOne({
        _id: singerId,
        deleted: false
      }).select("fullName slug");
      singers.push(singerCurrent);
    }
    //Tyscript khong cho phep them truong du lieu vao object da khai bao neu khong su dung extension, no van dung cau truc khai bao ban dau
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
}