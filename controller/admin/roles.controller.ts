import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import { rolesModel } from "../../models/roles.model";
import moment from "moment";
import { accountModel } from "../../models/account.model";

export const index = async (req: Request, res: Response)=>{
  const filter = {
    deleted: false
  }

  const pagination = await Pagination(req, filter, rolesModel);

  const records = await rolesModel.find(
    {deleted: false}
  )
  .skip(pagination.skip)
  .limit(pagination.limitItems);

  res.render(`${prefixAdmin}/pages/roles/index.pug`, {
    pageTitle: "Trang nhóm quyền",
    records: records,
    pagination: pagination
  });
};

export const create = async (req: Request, res: Response)=>{
  res.render(`admin/pages/roles/create.pug`, {
    pageTitle: "Trang nhóm quyền",
  });
};

export const createPost = async (req: Request, res: Response)=>{
  if(res.locals.role.permissions.includes("roles_create")){
    req.flash("success", "Tạo mới thành công!");
    req.body["idPersonCreated"] = res.locals.account.id;
    const newRecord = new rolesModel(req.body);
    await newRecord.save();
    res.redirect(`/${prefixAdmin}/roles`);
  }
  else{
    res.send("403");
  }
};

export const edit = async (req: Request, res: Response)=>{
  const id = req.params.id;
  try{
    const record = await rolesModel.findOne({
      _id: id
    });
    if(record){
      res.render(`admin/pages/roles/edit.pug`, {
        pageTitle: "Chỉnh sửa nhóm quyền",
        record: record
      });
    }
    else{
      req.flash("error", "Lỗi!");
      res.redirect(`/${prefixAdmin}/roles`);
    }
  }
  catch(error){
    req.flash("error", "Lỗi!");
    res.redirect(`/${prefixAdmin}/roles`);
  }
};

export const editPatch = async (req: Request, res: Response)=>{
  if(res.locals.role.permissions.includes("roles_edit")){
    try {
      const id = req.params.id;
      req.body["idPersonUpdated"] = res.locals.account.id;
      await rolesModel.updateOne({
        _id: id
      }, req.body);
      req.flash("success", "Đã cập nhật!");
      res.redirect(`/${prefixAdmin}/roles`);
    }
     catch (error) {
       res.send("403");
    }
  }
else{
  res.send("403");
}
};

export const permissions = async (req: Request, res: Response) => {
  const records = await rolesModel.find({
    deleted: false
  });

  res.render("admin/pages/roles/permissions.pug", {
    pageTitle: "Trang phân quyền",
    records: records
  });
};

export const permissionsPatch = async (req: Request, res: Response) => {
  if(res.locals.role.permissions.includes("roles_permissions")){
    try {
      const roleAndPermissions = req.body.rolesArray;
      roleAndPermissions.forEach(async (item : any)=> {
        await rolesModel.updateOne({
          _id: item.id,
        }, {
          permissions: item.permissions
        });
      });
      res.json({
        code: 200
      });
    } catch (error) {
      res.send("403");
    }
  }
  else{
    res.send("403");
  }
};

export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = await rolesModel.findOne({
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
      item["namePersonCreated"] = accountCreated.fullName;
    }
  
    res.render(`admin/pages/roles/detail.pug`,{
      pageTitle: "Chi tiết nhóm quyền",
      product : item
    });
  } catch (error) {
    res.send("403");
  }
}

export const deleteItem = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("roles_delete")){
    try{
      const id = req.params.id;   //res.params tra ve 1 ob chua cac bien dong tren url
      await rolesModel.updateOne(
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
      res.redirect(`${prefixAdmin}/roles`);
    }
  }
  else{
    res.send("403");
  }
};