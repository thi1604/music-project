import { Request, Response } from "express";
import { songModel } from "../../models/song.model";
import { singerModel } from "../../models/singer.model";
import { topicModel } from "../../models/topics.model";
import { likeSongModel } from "../../models/like-song.model";


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

  const existLike = await likeSongModel.findOne({
    userId: res.locals.user.id,
    songId: song.id,
    deleted: false
  });

  if(existLike){
    song["typeLike"] = "like";
  }
  // else {
  //   const dataLike = new likeSongModel({
  //     userId: res.locals.user.id,
  //     songId: song.id,
  //     deleted: false
  //   })
  //   await dataLike.save();
  //  }
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

export const like = async (req:Request, res: Response) => {
  try {
    const {id, type} = req.body;
    const song = await songModel.findOne({
      _id: id
    }).select("like");

    let likeCurrent = song.like;

    if(likeCurrent >= 0){
      if(type == "like"){
        likeCurrent += 1;

        const existLike = await likeSongModel.findOne({
          userId: res.locals.user.id,
          songId: song.id
        });

        if(!existLike){
          const dataLike = new likeSongModel({
            userId: res.locals.user.id,
            songId: song.id,
            deleted: false
          })
          await dataLike.save();
        }
        else{
          await likeSongModel.updateOne({
            userId: res.locals.user.id,
            songId: song.id
          }, {
            deleted: false
          });
        }
      }
      else{
        if(likeCurrent > 0)
          likeCurrent -= 1;
        await likeSongModel.updateOne({
          userId: res.locals.user.id,
          songId: song.id
        }, {
          deleted: true
        });
      }
    }
    await songModel.updateOne({
      _id: id
    }, {
      like: likeCurrent
    });

    res.json({
      code: 200,
      updateLike: likeCurrent
    });
  } catch (error) {
    console.log(error);
  }
};
