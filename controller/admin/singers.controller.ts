import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import { singerModel } from "../../models/singer.model";
import moment from "moment";
import { accountModel } from "../../models/account.model";

export const index = async (req : Request, res: Response) => {

  let record = await singerModel.find({
    deleted: false
  });

  const pagination = await Pagination(req, record, singerModel);

  if(req.query.page == '0'){
    pagination.currentPage = 1;
  }

  record = await 
  singerModel
  .find({deleted: false})
  .limit(pagination.limitItems)
  .skip(pagination.skip);

  res.render("admin/pages/singers/index.pug", {
    pageTitle: "Danh mục ca sĩ",
    listRecord: record,
    pagination: pagination
  });
}

export const changeStatus = async (req : Request, res: Response) => {
  if(res.locals.role.permissions.includes("singers_edit")){
    try{
      //req.params lay cac gia tri dong trong cai link, tra ve ob
      const {id, status} = req.params;

      await singerModel.updateOne(
        {
          _id : id
        }, 
        {
          status : status
        }
      );
      req.flash('success', 'Cập nhật thành công!');
      res.json({
        code: 200
      });
      //Tra data ve cho FE, code duoi tra ve 1 ob 
    }catch(error){
      res.redirect(`/${prefixAdmin}/singers`);
    }
  }
  else{
    res.send("403");
  }
}

export const create = async (req : Request, res: Response) => {
  res.render("admin/pages/singers/create.pug", {
    pageTitle: "Thêm mới danh mục sản phẩm"

  });
}

export const createPost = async (req : Request, res: Response) => {
  if(res.locals.role.permissions.includes("singers_create")){
    req.body["idPersonCreated"] = res.locals.account.id;
    const newSingers = new singerModel(req.body);
    req.flash("success", "Thêm ca sĩ thành công !");
    await newSingers.save(); // Phai co tu await(Doi luu vao database, ko co se chua kip luu)
    res.redirect(`/${prefixAdmin}/singers`);
  }
  else{
    res.send("403");
  }
}

export const edit = async (req : Request, res: Response) => {
  try{
    const id = req.params.id;
    const record = await singerModel.findOne({
      _id: id
    });
    if(record){
      res.render(`${prefixAdmin}/pages/singers/edit.pug`,{
        pageTitle: "Trang chỉnh sửa ca sĩ",
        product: record
      });
    }
    else{
      res.redirect(`/${prefixAdmin}/singers/edit/${id}`);
    }

  }
  catch(error){
    res.redirect(`/${prefixAdmin}/singers`);
  }
}

export const editPatch = async (req : Request, res: Response) => {
  if(res.locals.role.permissions.includes("singers_edit")){
    try {
      const id = req.params.id;
      req.body["idPersonUpdated"] = res.locals.account.id;

      await singerModel.updateOne(
      {
        _id : id
      }, req.body);
      req.flash("success", "Cập nhật thành công !");
      res.redirect(`/${prefixAdmin}/singers/edit/${id}`);
    } catch (error) {
      res.redirect(`/${prefixAdmin}/singers`);
    }
  }
  else{
    res.send("403");
  }
}

export const detail = async (req : Request, res: Response) =>{
  try {
    const id = req.params.id;
    const item = await singerModel.findOne({
      _id : id
    });
  
    item["formatCreatedAt"] = moment(item.createdAt).format("HH:mm:ss DD/MM/YY");
    item["formatUpdatedAt"] = moment(item.updatedAt).format("HH:mm:ss DD/MM/YY");
    
    // Lay ra nguoi tao
    const accountCreated = await accountModel.findOne({
      _id: item.idPersonCreated
    }).select("fullName");
    // Het lay ra nguoi tao
  
    // Lay ra nguoi updated
    const accountUpdated = await accountModel.findOne({
      _id: item.idPersonUpdated
    }).select("fullName");
    // End lay ra nguoi updated
  
    if(accountUpdated){
      item["namePersonUpdated"] = accountUpdated.fullName;
    }
    if(accountCreated){
      item["namePersonCreated"] = accountCreated.fullName;
    }
  
    res.render(`${prefixAdmin}/pages/singers/detail.pug`,{
      pageTitle: "Chi tiết ca sĩ",
      product : item
    });
  } catch (error) {
    console.log("error");
  }
}


export const deleteItem = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("singers_delete")){
    try{
      const id = req.params.id;   //res.params tra ve 1 ob chua cac bien dong tren url
      await singerModel.updateOne(
        {
          _id : id
        }, 
        {
          deleted : true,
          idPersonDeleted: res.locals.account.id
        }
      );

      req.flash('success', 'Xoá thành công!');
      res.json({
        code : 200
      });

    }catch(error){
      res.redirect(`${prefixAdmin}/songs`);
    }
  }
  else{
    res.send("403");
  }
};