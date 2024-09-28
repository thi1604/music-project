import { Request, Response } from "express"

export const index = async (req: Request, res: Response) => {
  res.render("admin/pages/dash-board/index.pug", {
    pageTitle: "Trang chủ"
  });
};