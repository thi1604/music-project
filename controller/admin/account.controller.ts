import e, { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import { userModel } from "../../models/user.model";
import md5 from "md5";
import { accountModel } from "../../models/account.model";

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


// export const create = async (req:Request, res: Response) => {


//   res.render("admin/pages/songs/create.pug", {
//     pageTitle: "Tạo mới admin",
//     topics: topics,
//     singers: singer
//   });
// };

// export const createPost = async (req:Request, res: Response) => {
//   const totalSecond = parseFloat(req.body["duration"]);
//   const minutes = Math.floor(totalSecond / 60);
//   const second = Math.floor(totalSecond % 60);
//   const totalTime = `${String(minutes).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
//   req.body["totalTime"] = totalTime;
//   // req.body["lyrics"] = req.body["lyrics"].join('\n');
//   console.log(req.body);
//   if(req.body.audio){
//     if(req.body.avatar){
//       req.body.avatar = req.body.avatar[0];
//     }
//     req.body.audio = req.body.audio[0];
//     const newSong = new songModel(req.body);
//     await newSong.save();
//     req.flash("success", "Tạo mới thành công!");
//   }
//   else{
//     req.flash("error", "Chưa có file âm thanh!");
//   }
//   res.redirect(`/${prefixAdmin}/songs/create`);
// };

// export const detail = async (req:Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const item = await userModel.findOne({
//       _id : id
//     });
  
//     // item.formatCreatedAt = moment(item.createdAt).format("HH:mm:ss DD/MM/YY");
//     // item.formatUpdatedAt = moment(item.updatedAt).format("HH:mm:ss DD/MM/YY");
  
  
//     //Lay ra nguoi tao
//     // const account = await Account.findOne({
//     //   _id: item.idPersonCreated
//     // }).select("fullName");
//     //Het lay ra nguoi tao
  
//     //Lay ra nguoi updated
//     // const accountUpdated = await Account.findOne({
//     //   _id: item.idPersonUpdated
//     // }).select("fullName");
//     //End lay ra nguoi updated
  
//     // if(accountUpdated){
//     //   item.namePersonUpdated = accountUpdated.fullName;
//     // }
//     // if(account){
//     //   item.namePersonCreated = account.fullName;
//     // }
    
//     res.render(`${prefixAdmin}/pages/users/detail.pug`,{
//       pageTitle: "Chi tiết người dùng",
//       product : item
//     });
//   } catch (error) {
//     res.send("403");
//   }
// }

// export const edit = async (req:Request, res: Response) => {
//   try{
//     const id = req.params.id;
//     const item = await userModel.findOne({
//       _id : id
//     });
    
//     res.render("admin/pages/users/edit.pug", {
//       pageTitle: "Trang chỉnh sửa user",
//       product: item
//     });
//   }catch{
//     res.redirect(`/${prefixAdmin}/users`);
//   }
// }

// export const editPatch = async (req:Request, res: Response) => {
//   // if(res.locals.role.permissions.includes("products_edit")){
//     const id = req.params.id;

//     // const idUpdated = res.locals.account.id;
//     // req.body.idPersonUpdated = idUpdated;
//     try{
//       const user = await userModel.findOne({
//         _id: id
//       })
//       if(req.body.password == ""){ //Check xem co gui password, neu khong giu lai pass cu
//         if(user){
//           req.body.password = user.password;
//         }
//       }
//       else {
//         req.body.password = md5(req.body.password);
//       }
//       delete req.body.email //Xoa trương email neu co
//       await userModel.updateOne({
//         _id : id
//       }, req.body);
//       req.flash('success', 'Đã cập nhật!');
//       res.redirect(`/${prefixAdmin}/users/edit/${id}`);
//     }
//     catch(error){
//       req.flash('error', 'Lỗi!');
//       res.redirect(`/${prefixAdmin}/users/edit/${id}`);
//     }
//   // }
//   // else{
//   //   res.send("403");
//   // } 
// }

// export const changeStatus = async (req:Request, res: Response) => {
//   try{
//     //req.params lay cac gia tri dong trong cai link, tra ve ob
//     const {id, status} = req.params;

//     await userModel.updateOne(
//       {
//         _id : id
//       }, 
//       {
//         status : status
//       }
//     );
//     req.flash('success', 'Cập nhật thành công!');
//     res.json({
//       code: 200
//     });
//     //Tra data ve cho FE, code duoi tra ve 1 ob 
//   }catch(error){
//     res.redirect(`/${prefixAdmin}/users`);
//   }
// }

// export const changeManyStatus = async (req:Request, res: Response) => {
//   // if(res.locals.role.permissions.includes("products_edit")){
//     const {ids, status} = req.body;
//       try{
//         if(status == "delete"){
//           await userModel.updateMany(
//             {
//               _id : ids
//             },
//             {
//               deleted: true
//             }
//           )
//         }
//         else{
//           await userModel.updateMany(
//             {
//               _id : ids
//             },
//             {
//               status: status
//             }
//           )
//         }
      
//         req.flash('success', 'Cập nhật thành công!');
//         res.json({
//           code : 200
//         });
//       }catch(error){
//         res.redirect(`/${prefixAdmin}/users`);
//       }
//   // }
//   // else{
//   //   res.send("403");
//   // }
// };