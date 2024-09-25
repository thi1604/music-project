import { Request, Response } from "express"
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";

export const index = async (req: Request, res: Response) => {
  const listTopics = await topicModel.find();
  
  res.render("client/pages/topics/index.pug", {
    pageTitle: "Danh sách chủ đề",
    listTopics: listTopics
  });
}

export const songsInTopic = async (req: Request, res: Response) => {
  const topicCurrent = await topicModel.findOne({
    slug: req.params.slugTopic
  }).select("id title");

  let listSongs = [];

  if(topicCurrent){
    listSongs = await songModel.find({
      topicId: topicCurrent.id
    });
  }

  for (const item of listSongs) {
    const singer =  await singerModel.findOne({
      _id: item.singerId
    }).select("fullName");

    item["singerFullName"] = singer.fullName;
  }

  res.render("client/pages/songs/list.pug", {
    pageTitle: `Chủ đề ${topicCurrent.title}`,
    listSongs: listSongs
  });

}