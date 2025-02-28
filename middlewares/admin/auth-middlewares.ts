import { NextFunction, Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { accountModel } from "../../models/account.model";
import { rolesModel } from "../../models/roles.model";


export const authMiddleware  = async (req :Request, res: Response, next: NextFunction) => {
  if(req.cookies.token == ""){
    res.redirect(`/${prefixAdmin}/auth/login`);
    return;
  }
  const account = await accountModel.findOne({
    token: req.cookies.token,
    deleted: false
  }).select("fullName email phone avatar status role_id");

  if(!account){
    res.redirect(`/${prefixAdmin}/auth/login`);
    return;
  }

  const role = await rolesModel.findOne({
    _id: account.role_id
  }).select("permissions title");


  res.locals.account = account; // su dung account cho cac middleware tiep theo(chua trong res.local)
  res.locals.role = role;
  next(); //Muon sai next() phai khai bao tren tham so
}