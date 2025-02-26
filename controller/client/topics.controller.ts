import { Request, Response } from "express"
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";

export const index = async (req: Request, res: Response) => {
  let filter = {
    deleted: false,
    status: "active"
  }

  // console.log(req.query.outStanding)

  if(req.body.outStanding == true){
    filter["outStanding"] = true
  }

  const listTopics = await topicModel.find(filter);
  
  res.json(listTopics);
}

export const songsInTopic = async (req: Request, res: Response) => {
  const topicCurrent = await topicModel.findOne({
    slug: req.params.slugTopic
  }).select("id title avatar description");

  let listSongs = [];
  let listSongsFinal = [];

  if(topicCurrent){
    listSongs = await songModel.find({
      topicId: topicCurrent.id,
      deleted: false,
      status: "active"
    });
  }

  if(listSongs.length > 0){
    for (const item of listSongs) {
      try {
        const singers =  await singerModel.find({
          _id: {$in: item.singerIds},
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
        }
        listSongsFinal.push(data);
      } catch (error) {
        res.json("Error!");
      }
    }
  }
  // console.log(listSongs);
  res.json({
    topicCurrent: topicCurrent,
    listSongs: listSongsFinal
  });
}