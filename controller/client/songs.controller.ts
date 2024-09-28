import { Request, Response } from "express";
import { songModel } from "../../models/song.model";
import { singerModel } from "../../models/singer.model";
import { topicModel } from "../../models/topics.model";
import { likeSongModel } from "../../models/like-song.model";
import { loveSongModel } from "../../models/love-song.model";
import unidecode from "unidecode";

// export const index = async (req: Request, res: Response) =>{
//   const listSongs = await songModel.find().select("-description");
//   res.render("client/pages/songs/list.pug", {
//     pageTitle: "Danh sách bài hát",
//     listSongs: listSongs
//   })
// }

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
  const existLove = await loveSongModel.findOne({
    userId: res.locals.user.id,
    songId: song.id,
  });

  if(existLike){
    song["typeLike"] = "like";
  }
  if(existLove){
    song["loveSong"] = "love";
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
  
  const type = req.params.type;
  
  const keyword = `${req.query.keyword}`;

  let songs = [];

  if(keyword){
    // let regex = new RegExp(keyword, "i");
    let keywordSlug = keyword;

    keywordSlug = keyword.trim();

    keywordSlug = keywordSlug.replace(/\s/g, "-");
    keywordSlug = keywordSlug.replace(/-+/g, "-"); 
    keywordSlug = unidecode(keywordSlug);
    // console.log(keywordSlug);
    const regexKeyWord = new RegExp(keyword, "i");
    const regexKeyWordSlug = new RegExp(keywordSlug, "i");
    // console.log(regexKeyWord, regexKeyWordSlug)
    songs = await songModel.find({
      $or: [
        {title: regexKeyWord}, 
        {slug: regexKeyWordSlug}
      ],
      deleted: false,
      status: "active"
    }).select("title avatar singerId slug");

    let songsResult = [];

    for (const item of songs) {
      const singer =  await singerModel.findOne({
        _id: item.singerId
      }).select("fullName");

      item["singerFullName"] = singer.fullName;

      //Tyscript chi dua vao khai bao ban dau de hoat dong cho object, du co them van lay khai bao ban dau neu khong dung cac extension
      const dataSong = {
        title: item.title,
        avatar: item.avatar,
        slug: item.slug,
        singerFullName: singer.fullName
      }
      songsResult.push(dataSong);
    }
  
    if(type == "result"){
      res.render("client/pages/songs/list.pug", {
        pageTitle: `Kết quả tìm kiếm: ${keyword}`,
        listSongs: songs
      });
    }
    else if(type == "suggest"){
      res.json({
        code: 200,
        songsFinal: songsResult
      });
    }
    else{
      res.json({
        code: 400
      });
    }
  }
  else{
    res.json({
      code: 400
    });
  }


  // res.send("ok");
}
