import { Request, Response } from "express";
import { songModel } from "../../models/song.model";


export const index = async (req: Request, res: Response) =>{
  const listSongs = await songModel.find().select("-description");
  res.render("client/pages/songs/index.pug", {
    pageTitle: "Danh sách bài hát",
    listSongs: listSongs
  })
}
