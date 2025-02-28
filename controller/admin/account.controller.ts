import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import md5 from "md5";
import { accountModel } from "../../models/account.model";
import { rolesModel } from "../../models/roles.model";
import { generateRandomString } from "../../helper/generate.helper";
import moment from "moment";

export const index = async (req:Request, res: Response) => {
  
  const filter = {
    deleted : false// Lay data tu modul theo object filter
  };

  if(req.query.status){
    filter["status"] = req.query["status"];
  }
  // Tìm kiếm
  let keyword: any = req.query["keyword"];
  if(req.query["keyword"]) {
    //Lay san pham theo keyword tuong doi
    const regex = new RegExp(keyword, "i");
    filter["fullName"] = regex;
    keyword = req.query.keyword;
  }
  // Hết Tìm kiếm

  // // Object chua tat ca cac nut trang thai
  const listFilter = [
    {
      label : "Tất cả",
      status : ""
    },
    {
      label : "Hoạt động",
      status : "active"
    },
    {
      label : "Dừng hoạt động",
      status : "inactive"
    }
  ];
  const listActions = [
    {
      label : "Hoạt động",
      status : "active"
    },
    {
      label : "Dừng hoạt động",
      status : "inactive"
    },
    {
      label : "Xóa",
      status : "delete"
    }
  ];
  //Lay ham phan trang tu folder helper
  const pagination = await Pagination(req, filter, accountModel);
  //Lay san pham ra theo trang
  const account = await 
  accountModel.find(filter)
  // .collation({ locale: 'en', strength: 2 })// Sort ko phan biet hoa thuong
  .limit(pagination.limitItems)
  .skip(pagination.skip)
  // .sort(sort);

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Quản lí admin",
    accounts: account,
    pagination: pagination,
    keyword: keyword,
    listFilter : listFilter,
    listActions : listActions,
  });
};


export const create = async (req :Request, res: Response) => {

  const roles = await rolesModel.find({
    deleted: false
  }).select("title");

  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Trang tạo mới tài khoản admin",
    roles: roles
  });
}


export const createPost = async (req :Request, res: Response) => {
  if(res.locals.role.permissions.includes("accounts_create")){
    try {
      
      req.body.password = md5(req.body.password);
      const token = generateRandomString(30);
      req.body.token = token;
      // Tim ten nhom quyen cho account
      const role = await rolesModel.findOne({
        _id: req.body.role_id,
        deleted : false
      }).select("title");

      req.body.roleName = role.title;

      req.body["idPersonCreated"] = res.locals.account.id;

      const newAccount = new accountModel(req.body);
      await newAccount.save();
      req.flash("success", "Tạo thành công!");  
      res.redirect(`/${prefixAdmin}/accounts`);
    } catch (error) {
      console.log(error);
    }
  }
  else{
    res.send("403");
  }
}

export const edit = async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    const Account = await accountModel.findOne({
      _id: id
    });
    if(Account){
      const roles = await rolesModel.find({
        deleted: false
      });
      res.render("admin/pages/accounts/edit.pug", {
        pageTitle : "Chỉnh sửa tài khoản",
        Account: Account,
        roles: roles
      })
    }
    else{
      req.flash("error", "Lỗi!");
      res.redirect(`/${prefixAdmin}/accounts`);
    }
  }catch(error){
    req.flash("error", "Lỗi!");
    res.redirect(`/${prefixAdmin}/accounts`);
  }
}  

export const editPatch = async (req: Request, res: Response) => {
  if(res.locals.role.permissions.includes("accounts_edit")){
    try{
      const id = req.params.id;
      const existAdmin = await accountModel.findOne({
        email: req.body.email,
        _id: {$ne: id}
      })
      if(existAdmin){ //check xem email da duoc dang ki chua
        req.flash("error", "Email đã tồn tại!");
        res.redirect(`/${prefixAdmin}/accounts/edit/${id}`);
      }
      else{
        if(req.body.password == ""){
          delete req.body.password
        }
        else
          req.body.password = md5(req.body.password);
        req.body["idPersonUpdated"] = res.locals.account.id;
        await accountModel.updateOne({
          _id: id
        }, req.body);
        req.flash("success", "Cập nhật thành công!");
        res.redirect(`/${prefixAdmin}/accounts/edit/${id}`);
      }
    }catch(error){
      req.flash("error", "Lỗi!");
      res.redirect(`/${prefixAdmin}/accounts`);
    }
  }
  else{
    res.send("403");
  }
}

export const detail = async (req:Request, res: Response)=>{
  try {
    const id = req.params.id;
    const item = await accountModel.findOne({
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
    res.render(`admin/pages/accounts/detail.pug`,{
      pageTitle: "Chi tiết tài khoản",
      product : item
    });
  } catch (error) {
    res.redirect(`${prefixAdmin}`);
  }
}

// //ChangeStatus

export const changeStatus = async (req: Request, res: Response) => {
  if(res.locals.role.permissions.includes("accounts_edit")){

    const {id, status} = req.params;
    try{
      const admin = await accountModel.findOne({
        _id: id
      });
      if(admin && (status == "active" || status == "inactive")){
        await accountModel.updateOne({
          _id : id
        }, {
          status: status
        });
        req.flash("success", "Cập nhật thành công!");
      }
      else{
        req.flash("error", "Lỗi!");
      }
    }
    catch(error){
      req.flash("error", "Lỗi!");
    }

    res.json({
      code: 200
    });
  }
  else{
    res.json({code : 403})
  }
}

// //End ChangeStatus

export const deleteItem = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("accounts_delete")){
    try{
      const id = req.params.id;   //res.params tra ve 1 ob chua cac bien dong tren url
      await accountModel.updateOne(
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
