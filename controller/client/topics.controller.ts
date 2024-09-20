import { Request, Response } from "express"
import { topicModel } from "../../models/topics.model";

export const index = async (req: Request, res: Response) => {
  const listTopics = await topicModel.find();
  
  res.render("client/pages/topics/index.pug", {
    pageTitle: "Danh sách chủ đề",
    listTopics: listTopics
  });
}