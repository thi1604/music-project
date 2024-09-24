import { Request, Response, NextFunction } from "express";
import { userModel } from "../../models/user.model";


export const infoUser = async (req:Request, res:Response, next:NextFunction) => {
  const idTokenUser = req.cookies.tokenUser;
  // console.log(idTokenUser);
  if(idTokenUser){
    const user = await userModel.findOne({
      tokenUser : idTokenUser
    });
    if(user){
      res.locals["user"] = user;
      // res.cookie(
      //   "cartId", 
      //   user.cartId, 
      //   // { expire: new Date(Date.now() + time)}
      // );
    }
  }
  next();
}