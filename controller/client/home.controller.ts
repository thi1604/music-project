import { Request, Response } from "express";
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";


export const index = async (req: Request, res: Response) =>{

  const filter = {
    outStanding: true,
    deleted: false,
    status: "active"
  }
 
  const listSingesrOS = await singerModel.find(filter);

  const listTopicsOS = await topicModel.find(filter);


  res.json({
    listSingesrOS: listSingesrOS,
    listTopicsOS: listTopicsOS
  })
}