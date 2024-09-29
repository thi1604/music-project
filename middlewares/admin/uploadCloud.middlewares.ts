import { NextFunction, Request, Response } from 'express';
import { streamUpload } from '../../helper/streamUpload.helper';

export const uploadtoCloud = (req:Request, res:Response, next:NextFunction)=>{
  if(req["file"]){
    const uploadtoCloud = async (buffer)=> {
      const result = await streamUpload(buffer);
      req.body[req["file"].fieldname] = result["url"];
      next(); //Luu y khi dung next
    };
    uploadtoCloud(req["file"].buffer);
  }
  else
    next();
}


export const uploadFieldsToCloud = async (req:Request, res:Response, next:NextFunction) => {
  if(req["files"]){
    for(const item in req["files"]){
      req.body[item] = [];
      for(const subItem of req["files"][item]){
        const result = await streamUpload(subItem.buffer);
        // console.log(result["url"]);
        req.body[item].push(result["url"]);
      }
    }
    next();
  }
  else{
    next();
  }
};