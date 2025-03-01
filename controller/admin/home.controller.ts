import { Request, Response } from "express";
import { countData } from "../../helper/get-data-to-DBoard.helper";
import { accountModel } from "../../models/account.model";
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";
import { userModel } from "../../models/user.model";


export const index = async (req: Request, res: Response) => {
  const statistic = {
    categoryProduct: await countData(topicModel),
    product: await countData(songModel),
    account:  await countData(accountModel),
    user: await countData(userModel),
    singer: await countData(singerModel)
  };

  res.render("admin/pages/home/index.pug", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
}