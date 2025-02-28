import { Request, Response } from "express";
import moment from "moment";
import { Pagination } from "../../helper/pagination.helper";
import { accountModel } from "../../models/account.model";
import { rolesModel } from "../../models/roles.model";
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";
import { userModel } from "../../models/user.model";

// songs
export const indexProduct = async (req : Request, res: Response)=>{
  const filter = {
    deleted : true// Lay data tu modul theo object filter
  };

  if(req.query.status){
    filter["status"] = req.query["status"];
  }
  // Tìm kiếm
  let keyword: any = req.query["keyword"];
  if(req.query["keyword"]) {
    //Lay san pham theo keyword tuong doi
    const regex = new RegExp(keyword, "i");
    filter["title"] = regex;
    keyword = req.query.keyword;
  }
  
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
        label : "Khôi phục",
        status : "restore"
      },
      {
        label : "Xóa vĩnh viễn",
        status : "permanently-deleted"
      }
    ]
  
    const pagination = await Pagination(req, filter, songModel);
    const listProducts = await songModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for(const item  of listProducts){
      const namePersonDeleted = await accountModel.findOne({
        _id: item.idPersonDeleted
      }).select("fullName");
      if(namePersonDeleted){
        item["namePersonDeleted"] = namePersonDeleted.fullName;
      }
      item["formatUpdatedAt"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
  
    res.render("admin/pages/trash/products/index.pug", {
      pageTitle : "Trang thùng rác",
      listProducts: listProducts,
      pagination : Pagination,
      listFilter : listFilter,
      listActions : listActions,
      keyword: keyword
    });
}

export const restoreProduct = async(req: Request, res: Response) => {
  try {
    if(res.locals.role.permissions.includes("roles_permissions")){
      const id = req.params.id;
      await songModel.updateOne({
        _id : id
      }, 
      {
        deleted : false
      });
      req.flash('success', 'Khôi phục thành công!');
      res.json({
        code : 200
      })
    }
    else
      res.send("403");
  } catch (error) {
    res.send("403");
  }
}

export const permanentlyDeletedProduct = async(req : Request, res: Response) => {
  try {
    if(res.locals.role.permissions.includes("roles_permissions")){
      const id = req.params.id;
    
      await songModel.deleteOne({
        _id : id
      });
      req.flash('success', 'Xóa thành công!');
      res.json({
        code : 200
      })
    }
  
    else
      res.send("403");
  } catch (error) {
    res.send("403");
  }
}

export const changeManyItemProduct = async(req : Request, res: Response) => {
  try {
    
    if(res.locals.role.permissions.includes("roles_permissions")){
      const {ids, status} = req.body;
  
      if(status == "restore"){
        req.flash('success', 'Khôi phục thành công!');
        await songModel.updateMany({
          _id : ids
        }, 
        {
          deleted: false
        });
      }
      else{
        req.flash('success', 'Xóa thành công!');
        await songModel.deleteMany({
          _id: ids
        });
      }
      res.json({
        code : 200
      })
    }
    else
      res.send("403");
  } catch (error) {
    res.send("403");
  }
}
//End songs

// Role
export const indexRole = async (req : Request, res: Response)=>{
    const filter = {
      deleted : true
    };  
    const pagination = await Pagination(req, filter, rolesModel);
    const listProducts = await rolesModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
    for(const item of listProducts){
      const namePersonDeleted = await accountModel.findOne({
        _id: item.idPersonDeleted
      }).select("fullName");
      if(namePersonDeleted){
        item["namePersonDeleted"] = namePersonDeleted.fullName;
      }
      item["formatUpdatedAt"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    }
  
    res.render("admin/pages/trash/role/index.pug", {
      pageTitle : "Trang thùng rác",
      listProducts: listProducts,
      pagination : Pagination
    });
}

export const restorePatch = async (req : Request, res: Response)=>{
  if(res.locals.role.permissions.includes("trash_edit")){
    try {
      const id = req.body.idRole;
      const item = rolesModel.findOne({
        _id: id
      });
      if(!item){
        req.flash("error", "Lỗi!");
      }
      else{
          const id = req.params.id;
          await rolesModel.updateOne({
            _id : id
          }, 
          {
            deleted : false
          });
          req.flash('success', 'Khôi phục thành công!');
          res.json({
            code : 200
          })
      }
    } catch (error) {
      req.flash("error", "Lỗi!");
    }
  }
  else{
    res.send("403");
  }
}
//End Role

// topics
export const indexTopics = async (req : Request, res: Response)=>{
  const filter = {
    deleted : true
  };  
  const pagination = await Pagination(req, filter, topicModel);
  const listProducts = await topicModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
  for(const item of listProducts){
    const namePersonDeleted = await accountModel.findOne({
      _id: item.idPersonDeleted
    }).select("fullName");
    if(namePersonDeleted){
      item["namePersonDeleted"] = namePersonDeleted.fullName;
    }
    item["formatUpdatedAt"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }

  res.render("admin/pages/trash/topic/index.pug", {
    pageTitle : "Trang thùng rác",
    listProducts: listProducts,
    pagination : Pagination
  });
}

export const restoreTopic = async (req : Request, res: Response)=>{
  if(res.locals.role.permissions.includes("trash_edit")){
    try {
      const id = req.params.id;
      await topicModel.updateOne({
        _id : id
      }, 
      {
        deleted : false
      });
      req.flash('success', 'Khôi phục thành công!');
      res.json({
        code : 200
      })
    } catch (error) {
      req.flash("error", "Lỗi!");
    }
  }
  else{
    res.send("403");
  }
}

// singers
export const indexSingers = async (req : Request, res: Response)=>{
  const filter = {
    deleted : true
  };  
  const pagination = await Pagination(req, filter, singerModel);
  const listProducts = await singerModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
  for(const item of listProducts){
    const namePersonDeleted = await accountModel.findOne({
      _id: item.idPersonDeleted
    }).select("fullName");
    if(namePersonDeleted){
      item["namePersonDeleted"] = namePersonDeleted.fullName;
    }
    item["formatUpdatedAt"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }

  res.render("admin/pages/trash/singer/index.pug", {
    pageTitle : "Trang thùng rác",
    listProducts: listProducts,
    pagination : Pagination
  });
}

export const restoreSingers = async (req : Request, res: Response)=>{
  if(res.locals.role.permissions.includes("trash_edit")){
    try {
      const id = req.params.id;
      await singerModel.updateOne({
        _id : id
      }, 
      {
        deleted : false
      });
      req.flash('success', 'Khôi phục thành công!');
      res.json({
        code : 200
      })
    } catch (error) {
      req.flash("error", "Lỗi!");
    }
  }
  else{
    res.send("403");
  }
}

//users
export const indexUsers = async (req : Request, res: Response)=>{
  const filter = {
    deleted : true
  };  
  const pagination = await Pagination(req, filter, userModel);
  const listProducts = await userModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
  // for(const item of listProducts){
  //   const namePersonDeleted = await accountModel.findOne({
  //     _id: item.idPersonDeleted
  //   }).select("fullName");
  //   if(namePersonDeleted){
  //     item["namePersonDeleted"] = namePersonDeleted.fullName;
  //   }
  //   item["formatUpdatedAt"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  // }

  res.render("admin/pages/trash/user/index.pug", {
    pageTitle : "Trang thùng rác",
    listProducts: listProducts,
    pagination : Pagination
  });
}

export const restoreUsers = async (req : Request, res: Response)=>{
  if(res.locals.role.permissions.includes("trash_edit")){
    try {
      const id = req.params.id;
      await userModel.updateOne({
        _id : id
      }, 
      {
        deleted : false
      });
      req.flash('success', 'Khôi phục thành công!');
      res.json({
        code : 200
      })
    } catch (error) {
      req.flash("error", "Lỗi!");
    }
  }
  else{
    res.send("403");
  }
}

// // Account
export const indexAccount = async (req: Request, res: Response)=>{
  const filter = {
    deleted : true
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
      label : "Khôi phục",
      status : "restore"
    },
    {
      label : "Xóa vĩnh viễn",
      status : "permanently-deleted"
    }
  ]

  const pagination = await Pagination(req, filter, accountModel);
  
  const listProducts = await accountModel.find(filter).limit(pagination.limitItems).skip(pagination.skip);
  for(const item of listProducts){
    const namePersonDeleted = await accountModel.findOne({
      _id: item.idPersonUpdated
    }).select("fullName");
    if(namePersonDeleted){
      item["namePersonDeleted"] = namePersonDeleted.fullName;
    }
    item["formatUpdatedAt"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }

  res.render("admin/pages/trash/accounts/index.pug", {
    pageTitle : "Trang thùng rác",
    listProducts: listProducts,
    pagination : pagination,
    listFilter : listFilter,
    listActions : listActions,
    keyword: keyword
  });
}

export const restoreAccPatch = async (req: Request, res: Response)=>{
  if(res.locals.role.permissions.includes("trash_edit")){
    try {
      const id = req.params.id;
      await accountModel.updateOne({
        _id : id
      }, 
      {
        deleted : false
      });
      req.flash('success', 'Khôi phục thành công!');
      res.json({
        code : 200
      })
    } catch (error) {
      req.flash("error", "Lỗi!");
    }
  }
  else{
    res.send("403");
  }
}
//End Account

