import { Request, Response } from "express"
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";

export const index = async (req: Request, res: Response) => {
  let filter = {
    deleted: false
  }

  // console.log(req.query.outStanding)

  if(req.body.outStanding == true){
    filter["outStanding"] = true
  }

  const listTopics = await topicModel.find(filter);
  
  res.send(listTopics);
}

export const songsInTopic = async (req: Request, res: Response) => {
  const topicCurrent = await topicModel.findOne({
    slug: req.params.slugTopic
  }).select("id title avatar description");

  let listSongs = [];

  if(topicCurrent){
    listSongs = await songModel.find({
      topicId: topicCurrent.id,
      deleted: false
    });
  }

  for (const item of listSongs) {
    const singer =  await singerModel.findOne({
      _id: item.singerId,
      deleted: false
    }).select("fullName");

    item["singerFullName"] = singer.fullName || "";
  }
  res.send({
    topicCurrent: topicCurrent,
    listSongs: listSongs
  });
}