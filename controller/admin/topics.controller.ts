import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import { topicModel } from "../../models/topics.model";

export const index = async (req : Request, res: Response) => {

  let record = await topicModel.find({
    deleted: false
  });

  const pagination = await Pagination(req, record, topicModel);

  if(req.query.page == '0'){
    pagination.currentPage = 1;
  }

  record = await 
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

// module.exports.create = async (req, res) => {
//   const record = await ProductCategory.find({
//     deleted: false
//   });

//   const categoryTree = selectTreeHelper(record);

//   res.render("admin/pages/products-category/create.pug", {
//     pageTitle: "Thêm mới danh mục sản phẩm",
//     listRecord: record,
//     categoryTree: categoryTree
//   });
// }

// module.exports.createPost = async (req, res) => {
//   if(res.locals.role.permissions.includes("products-category_create")){
//     if(req.body.position){
//       req.body.position = parseInt(req.body.position);
//     }
//     else{
//       req.body.position = (await ProductCategory.countDocuments({})) + 1;
//     }
//     req.body.idPersonCreated = res.locals.account.id;
//     const newCategory = new ProductCategory(req.body);
//     req.flash("success", "Thêm danh mục thành công !");
//     await newCategory.save(); // Phai co tu await(Doi luu vao database, ko co se chua kip luu)
//     res.redirect("/admin/products-category");
//   }
//   else{
//     res.send("403");
//   }
// }

// module.exports.edit = async (req, res) => {
//   try{
//     const id = req.params.id;
//     const record = await ProductCategory.findOne({
//       _id: id
//     });
//     const records = await ProductCategory.find({
//       deleted: false
//     });

//     const listRecord = selectTreeHelper(records);
//     if(record){
//       res.render(`${prefix}/pages/products-category/edit.pug`,{
//         pageTitle: "Trang chỉnh sửa danh mục",
//         product: record,
//         listRecord: listRecord
//       });
//     }
//     else{
//       res.redirect(`/${prefix}/products-category`);
//     }

//   }
//   catch(error){
//     res.redirect(`/${prefix}/products-category`);
//   }
// }

// module.exports.editPatch = async (req, res)=> {
//   if(res.locals.role.permissions.includes("products-category_edit")){
//     const id = req.params.id;
//     req.body.idPersonUpdated = res.locals.account.id;

//     await ProductCategory.updateOne(
//     {
//       _id : id
//     }, req.body);
    
//     res.redirect('back');
//   }
//   else{
//     res.send("403");
//   }
// }

// module.exports.detail = async (req, res)=>{
//   try {
    
//     const id = req.params.id;
//     const item = await ProductCategory.findOne({
//       _id : id
//     });
  
//     item.formatCreatedAt = moment(item.createdAt).format("HH:mm:ss DD/MM/YY");
//     item.formatUpdatedAt = moment(item.updatedAt).format("HH:mm:ss DD/MM/YY");
    
//     //Lay ra nguoi tao
//     const accountCreated = await account.findOne({
//       _id: item.idPersonCreated
//     }).select("fullName");
//     //Het lay ra nguoi tao
  
//     //Lay ra nguoi updated
//     const accountUpdated = await account.findOne({
//       _id: item.idPersonUpdated
//     }).select("fullName");
//     //End lay ra nguoi updated
  
//     if(accountUpdated){
//       item.namePersonUpdated = accountUpdated.fullName;
//     }
//     if(accountCreated){
//       item.namePersonCreated = accountCreated.fullName;
//     }
  
//     res.render(`${prefix}/pages/products-category/detail.pug`,{
//       pageTitle: "Chi tiết nhóm quyền",
//       product : item
//     });
//   } catch (error) {
//     console.log("error");
//   }
// }