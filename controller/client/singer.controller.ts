import { Request, Response } from "express";
import { singerModel } from "../../models/singer.model";

export const index = async (req: Request, res: Response) => {
  let filter = {
    deleted: false
  }

  if (req.body.outStanding && req.body.outStanding == true) {
    filter["outStanding"] = true;
  }

  const listSinger = await singerModel.find(filter);
  res.send(listSinger);
}