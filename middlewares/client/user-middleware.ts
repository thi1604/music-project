import { Request, Response, NextFunction } from "express";
import { userModel } from "../../models/user.model";


export const infoUser = async (req:Request, res:Response, next:NextFunction) => {
  const tokenUser = req.body.tokenUser;
  if(tokenUser){
    const user = await userModel.findOne({
      tokenUser : tokenUser
    });
    if(user){
      req["tokenUser"] = user.tokenUser;
      next();
    }
    else{
      res.json({
        code: 400,
        messages: "Token không chính xác!"
      })
      return;
    }
  }
  else{
    res.json({
      code: 400,
      messages: "Thiếu token!"
    })
    return;
  }
}