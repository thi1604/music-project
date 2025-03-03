import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import { topicModel } from "../../models/topics.model";
import moment from "moment";
import { accountModel } from "../../models/account.model";


export const index = async (req : Request, res: Response) => {

  // let record = await topicModel.find({
  //   deleted: false
  // });
  const filter = {
    deleted: false
  }

  const pagination = await Pagination(req, filter, topicModel);

  if(req.query.page == '0'){
    pagination.currentPage = 1;
  }

  const record = await 
  topicModel
  .find({deleted: false})
  .limit(pagination.limitItems)
  .skip(pagination.skip);

  res.render("admin/pages/topics/index.pug", {
    pageTitle: "Danh mục bài hát",
    listRecord: record,
    pagination: pagination
  });
}

export const changeStatus = async (req : Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs-category_edit")){
    try{
      //req.params lay cac gia tri dong trong cai link, tra ve ob
      const {id, status} = req.params;

      await topicModel.updateOne(
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
      res.redirect(`/${prefixAdmin}/topics`);
    }
  }
  else{
    res.send("403");
  }
}

export const create = async (req : Request, res: Response) => {
  res.render("admin/pages/topics/create.pug", {
    pageTitle: "Thêm mới danh mục sản phẩm"
  });
}

export const createPost = async (req : Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs-category_create")){
    req.body["idPersonCreated"] = res.locals.account.id;
    const newTopics = new topicModel(req.body);
    req.flash("success", "Thêm danh mục thành công !");
    await newTopics.save(); // Phai co tu await(Doi luu vao database, ko co se chua kip luu)
    res.redirect(`/${prefixAdmin}/topics`);
  }
  else{
    res.send("403");
  }
}

export const edit = async (req : Request, res: Response) => {
  try{
    const id = req.params.id;
    const record = await topicModel.findOne({
      _id: id
    });
    if(record){
      res.render(`${prefixAdmin}/pages/topics/edit.pug`,{
        pageTitle: "Trang chỉnh sửa danh mục",
        product: record
      });
    }
    else{
      res.redirect(`/${prefixAdmin}/topics`);
    }

  }
  catch(error){
    res.redirect(`/${prefixAdmin}/topics`);
  }
}

export const editPatch = async (req : Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs-category_edit")){
    const id = req.params.id;
    req.body["idPersonUpdated"] = res.locals.account.id;

    await topicModel.updateOne(
    {
      _id : id
    }, req.body);
    req.flash("success", "Cập nhật thành công !");
    res.redirect(`/${prefixAdmin}/topics`);
  }
  else{
    res.send("403");
  }
}

export const detail = async (req : Request, res: Response) =>{
  try {
    const id = req.params.id;
    const item = await topicModel.findOne({
      _id : id
    });
  
    item["formatCreatedAt"] = moment(item.createdAt).format("HH:mm:ss DD/MM/YY");
    item["formatUpdatedAt"] = moment(item.updatedAt).format("HH:mm:ss DD/MM/YY");
    
    //Lay ra nguoi tao
    const accountCreated = await accountModel.findOne({
      _id: item.idPersonCreated
    }).select("fullName");
    //Het lay ra nguoi tao
  
    //Lay ra nguoi updated
    const accountUpdated = await accountModel.findOne({
      _id: item.idPersonUpdated
    }).select("fullName");
    //End lay ra nguoi updated
  
    if(accountUpdated){
      item["namePersonUpdated"] = accountUpdated.fullName;
    }
    if(accountCreated){
      item["namePersonUpdated"] = accountCreated.fullName;
    }
  
    res.render(`${prefixAdmin}/pages/topics/detail.pug`,{
      pageTitle: "Chi tiết danh mục",
      product : item
    });
  } catch (error) {
    console.log("error");
  }
}

export const deleteItem = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs-category_delete")){
    try{
      const id = req.params.id;   //res.params tra ve 1 ob chua cac bien dong tren url
      await topicModel.updateOne(
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