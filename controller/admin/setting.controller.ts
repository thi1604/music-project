import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { settingsModel } from "../../models/setting.model";


export const general = async (req: Request, res: Response) => {

  const data = await settingsModel.findOne({});

  res.render("admin/pages/setting/general.pug", {
    pageTitle: "Cài đặt chung",
    setting: data
  });
}

export const generalPost = async (req: Request, res: Response) => {
  if(res.locals.role.permissions.includes("setting_edit")){
    try {
      const data = await settingsModel.findOne({});
      if(data){
        await settingsModel.updateOne({
          _id : data.id
        }, req.body);
      }
      else{
        const newData = new settingsModel(req.body);
        await newData.save();
      }
      req.flash("success", "Cập nhật thành công!");
      res.redirect(`/${prefixAdmin}/settings/general`);
    } catch (error) {
    res.send("403");
    }
  }
  else{
    res.send("403");
  }
}