import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";

import md5 from "md5";
import { accountModel } from "../../models/account.model";

export const login = async (req: Request, res: Response) => {
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Trang đăng nhập"
  });
};

export const loginPost = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  const record = await accountModel.findOne({
    email: email
  });

  if(!record){
    req.flash("error", "Tài khoản hoặc mật khẩu không chính xác!");
    res.redirect(`/${prefixAdmin}/auth/login`);
    return;
  }

  if(md5(password) != record.password){
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect(`/${prefixAdmin}/auth/login`);
    return;
  }

  req.flash("success", "Đăng nhập thành công!");
  res.cookie("token", record.token);
  res.redirect(`/${prefixAdmin}/dashboard`);
}

export const logOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect(`/${prefixAdmin}/auth/login`);
}