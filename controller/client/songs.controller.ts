import { Request, Response } from "express";
import { songModel } from "../../models/song.model";
import { singerModel } from "../../models/singer.model";
import { topicModel } from "../../models/topics.model";
import { likeSongModel } from "../../models/like-song.model";
import { loveSongModel } from "../../models/love-song.model";
import unidecode from "unidecode";

export const detail = async (req: Request, res: Response) => {
  const slugSong : string = req.params.slugSong;

  const song = await songModel.findOne({
    slug: slugSong,
    deleted: false,
    status: "active"
  }).select("-status -deleted");

  if(!song){
    res.send({
      code: 400,
      messages: "Bài hát không tồn tại trong hệ thống!"
    })
    return;
  }

  // const userLogined = res.locals["user"];
  // if(userLogined){
  //   const existLike = await likeSongModel.findOne({
  //     userId: userLogined["id"],
  //     songId: song.id,
  //     deleted: false
  //   });
  //   const existLove = await loveSongModel.findOne({
  //     userId: userLogined["id"],
  //     songId: song.id,
  //   });
  
  //   if(existLike){
  //     song["typeLike"] = "like";
  //   }
  //   if(existLove){
  //     song["loveSong"] = "love";
  //   }
  // }
  const singers = await singerModel.find({
    _id: {$in: song.singerIds},
    deleted: false
  }).select("fullName slug");

  res.send({
    songCurrent: song,
    singer: singers
  })
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

export const love = async (req:Request, res: Response) => {
  try {
    const {id} = req.body;
    
    const existLoveSong = await loveSongModel.findOne({
      userId: res.locals.user.id,
      songId: id
    });

    let status:string = "";

    if(existLoveSong){
      await loveSongModel.deleteOne({
        userId: res.locals.user.id,
        songId: id
      });
      status = "noLove";
    }
    else{
      const data = new loveSongModel({
        userId: res.locals.user.id,
        songId: id
      });
      await data.save();
      status = "love";
    }
    res.json({
      code: 200,
      status: status
    });
  } catch (error) {
    console.log(error);
  }
};

export const search = async (req: Request, res: Response) => { 

  let keyword = `${req.params.keyword}`;
  let songs = [];
  let songsResult = [];
  if(keyword){
    let keywordSlug = keyword;
    keywordSlug = keyword.trim();
    keywordSlug = keywordSlug.replace(/\s+/g, "-");
    keywordSlug = unidecode(keywordSlug);

    const regexKeyWord = new RegExp(keyword, "i");
    const regexKeyWordSlug = new RegExp(keywordSlug, "i");

    const singers = await singerModel.find({
      $or: [
        {fullName: regexKeyWord},
        {slug:regexKeyWordSlug}
      ],
      deleted: false,
      status: "active"
    }).select("id");

    const listsingersId = singers.map(item => item.id);

    songs = await songModel.find({ //Tim kiem theo bai hat va ca si
      $or: [
        {title: regexKeyWord},
        {slug: regexKeyWordSlug},
        {singerIds: {$in: listsingersId}} //Tim bai hat co ca si hat bai hat do
      ],
      deleted: false,
      status: "active"
    }).select("title avatar singerIds slug");

    for (const item of songs) {
      const singers =  await singerModel.find({
        _id: {$in: item.singerIds}
      }).select("fullName");

      // item["singerFullName"] = singer.fullName;
      //Tyscript chi dua vao khai bao ban dau de hoat dong cho object, du co them van lay khai bao ban dau neu khong dung cac extension
      const dataSong = {
        title: item.title,
        avatar: item.avatar,
        slug: item.slug,
        singers: singers
      }
      songsResult.push(dataSong);
    }
  }
  res.send(songsResult);
}

export const listenNumberPatch = async (req: Request, res: Response) => {
  const idSong = req.params.idSong;
  try {
    const song = await songModel.findOne({
      _id: idSong
    }).select("listenNumber");
    if(song){
      let listenNumberCurrent = song.listenNumber;
      listenNumberCurrent += 1;
      await songModel.updateOne({
        _id: idSong
      }, {
        "listenNumber": listenNumberCurrent
      });
      res.json({
        code: 200,
        messager: "Cập nhật thành công",
        newListen : listenNumberCurrent
      });
    }
    else{
      res.json({
        code: 400
      });
    }
  } catch (error) {
    res.json({
      code: 400
    });
  }
}
