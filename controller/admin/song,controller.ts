import { Request, Response } from "express";
import { prefixAdmin } from "../../config/system";
import { Pagination } from "../../helper/pagination.helper";
import { singerModel } from "../../models/singer.model";
import { songModel } from "../../models/song.model";
import { topicModel } from "../../models/topics.model";
import moment from 'moment';
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
    filter["title"] = regex;
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
  const pagination = await Pagination(req, filter, songModel);
  //Lay san pham ra theo trang
  const songs = await 
  songModel.find(filter)
  // .collation({ locale: 'en', strength: 2 })// Sort ko phan biet hoa thuong
  .limit(pagination.limitItems)
  .skip(pagination.skip)
  // .sort(sort);

  res.render("admin/pages/songs/index.pug", {
    pageTitle: "Quản lí bài hát",
    songs: songs,
    pagination: pagination,
    keyword: keyword,
    listFilter : listFilter,
    listActions : listActions,
  });
};

export const detail = async (req:Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = await songModel.findOne({
      _id : id
    });
  
    item["formatCreatedAt"] = moment(item.createdAt).format("HH:mm:ss DD/MM/YY");
    item["formatUpdatedAt"] = moment(item.updatedAt).format("HH:mm:ss DD/MM/YY");
  
  
    //Lay ra nguoi tao
    const account = await accountModel.findOne({
      _id: item.idPersonCreated
    }).select("fullName");
    //Het lay ra nguoi tao
  
    //Lay ra nguoi updated
    const accountUpdated = await accountModel.findOne({
      _id: item.idPersonUpdated
    }).select("fullName");
    //End lay ra nguoi updated
  
    if(accountUpdated){ // Lay ra nguoi update (neu co)
      item["namePersonUpdated"] = accountUpdated.fullName;
    }
    if(account){
      item["namePersonCreated"] = account.fullName;
    }
    
    res.render(`${prefixAdmin}/pages/songs/detail.pug`,{
      pageTitle: "Chi tiết sản phẩm",
      product : item
    });
  } catch (error) {
    res.send("403");
  }
}

export const edit = async (req:Request, res: Response) => {
  try{
    const id = req.params.id;
    const item = await songModel.findOne({
      _id : id
    });
    
    const listTopics = await topicModel.find({
      deleted: false,
      status: "active"
    });

    const listSingers = await singerModel.find({
      deleted: false,
      status: "active"
    })
  
    res.render("admin/pages/songs/edit.pug", {
      pageTitle: "Trang chỉnh sửa bài hát",
      product: item,
      listTopics: listTopics,
      singers: listSingers
    });
  }catch{
    res.redirect(`/${prefixAdmin}/songs`);
  }
}

export const editPatch = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs_edit")){
    const id = req.params.id;

    req.body.listenNumber = parseInt(req.body.listenNumber);

    const idUpdated = res.locals.account.id;
    req.body.idPersonUpdated = idUpdated;
    try{
      await songModel.updateOne({
        _id : id
      }, req.body);
      req.flash('success', 'Đã cập nhật!');
      res.redirect(`/${prefixAdmin}/songs/edit/${id}`);
    }
    catch(error){
      req.flash('error', 'Lỗi!');
      res.redirect(`/${prefixAdmin}/songs/edit/${id}`);
    }
  }
  else{
    res.send("403");
  }
}

export const create = async (req:Request, res: Response) => {
  const topics = await topicModel.find({
    status: "active",
    deleted: false
  }).select("title"); //Truong id tu dong lay ra


  const singer = await singerModel.find({
    status: "active",
    deleted: false
  }).select("fullName");

  res.render("admin/pages/songs/create.pug", {
    pageTitle: "Tạo mới bài hát",
    topics: topics,
    singers: singer
  });
};

export const createPost = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs_create")){
    const totalSecond = parseFloat(req.body["duration"]);
    const minutes = Math.floor(totalSecond / 60);
    const second = Math.floor(totalSecond % 60);
    const totalTime = `${String(minutes).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
    req.body["totalTime"] = totalTime;
    // req.body["lyrics"] = req.body["lyrics"].join('\n');
    console.log(req.body);
    if(req.body.audio){
      if(req.body.avatar){
        req.body.avatar = req.body.avatar[0];
      }
      req.body.audio = req.body.audio[0];
      const newSong = new songModel(req.body);
      await newSong.save();
      req.flash("success", "Tạo mới thành công!");
    }
    else{
      req.flash("error", "Chưa có file âm thanh!");
    }
  res.redirect(`/${prefixAdmin}/songs/create`);
  }
  else{
    res.send("403");
  }
};

export const changeStatus = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs_edit")){
    try{
      //req.params lay cac gia tri dong trong cai link, tra ve ob
      const {id, status} = req.params;

      await songModel.updateOne(
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
      res.redirect(`/${prefixAdmin}/product`);
    }
  }
  else{
    res.send("403");
  }
}

export const changeManyStatus = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs_edit")){
    const {ids, status} = req.body;
      try{
        if(status == "delete"){
          await songModel.updateMany(
            {
              _id : ids
            },
            {
              deleted: true
            }
          )
        }
        else{
          await songModel.updateMany(
            {
              _id : ids
            },
            {
              status: status
            }
          )
        }
      
        req.flash('success', 'Cập nhật thành công!');
        res.json({
          code : 200
        });
      }catch(error){
        res.redirect(`/${prefixAdmin}/songs`);
      }
  }
  else{
    res.send("403");
  }
};


export const deleteItem = async (req:Request, res: Response) => {
  if(res.locals.role.permissions.includes("songs_delete")){
    try{
      const id = req.params.id;   //res.params tra ve 1 ob chua cac bien dong tren url
      await songModel.updateOne(
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