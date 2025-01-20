import {Request, Response} from "express";
import { forgotPasswordModel } from "../../models/forgot-password.model";
import {userModel} from "../../models/user.model";
import md5 from "md5";
import {generateRandomString, generateRandomNumber} from "../../helper/generate.helper";
import {sendEmail} from "../../helper/sendEmail.helper";

// export const register = async (req:Request, res:Response) => {
//   res.render("client/pages/user/register.pug", {
//     pageTitle: "Trang đăng kí"
//   });
// }

export const registerPost = async (req:Request, res:Response) => {
  if(!req.body.fullName || !req.body.email || !req.body.password || !req.body.authenPass){
    res.json({
      code: 400,
      messages: "Thiếu các trường thông tin bắt buộc",
      flag: 0
    });
    return;
  }
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  //Check email
  const check = regexEmail.test(req.body.email);
  if(!check){
    res.send({
      code: 400,
      messager: "Email không đúng định dạng",
      flag: 1
    });
    return;
  }
  // Check passwork
  const regexPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;

  const checkPass = regexPass.test(req.body.password);
  if(!checkPass){
    res.send({
      code: 400,
      messager: "Mật khẩu không đúng định dạng!",
      flag: 2
    });
    return;
  }
  else if(req.body.password != req.body.authenPass){
    res.send({
      code: 400,
      messager: "Mật khẩu không trùng khớp!",
      flag: 3
    });
    return;
  }
  //Check xem email da ton tai hay chua
  const existUser = await userModel.findOne({
    email : req.body.email
  });

  if(existUser){
    res.send({
      code: 400,
      messager: "Email đã được đăng kí!",
      flag: 4
    });
    return;
  }

  const tokenUser = generateRandomString(30);

  req.body.tokenUser = tokenUser;
  req.body.password = md5(req.body.password);
  
  const user = new userModel(req.body);
  await user.save(); //luu user moi vao csdl

  res.send({
    code:200,
    token: tokenUser,
    messages: "Đăng kí thành công!"
  })
  // const time = 24 * 3 * 60 * 60 * 1000;
  // res.cookie("tokenUser", user.tokenUser, { expires: new Date(Date.now() + time)});
  // req.flash("success", "Đăng kí thành công!");
  // res.redirect("/");
}

// export const login = async (req:Request, res:Response) => {
//   res.render("client/pages/user/login.pug", {
//     pageTitle: "Trang đăng nhập"
//   });
// }

export const loginPost = async (req:Request, res:Response) => {
  const emailCurrent = req.body.email;
  const user = await userModel.findOne({
    email : emailCurrent
  });
  if(!user){
    res.send({
      code: 400,
      messages: "Sai thông tin email!",
      flag: 1
    });
    return;
  }
  const passwork = req.body.passwork;
  if(md5(passwork) != user.password){

    res.send({
      code: 400,
      messages: "Sai mật khẩu!",
      flag: 2
    });
    return;
  }
  if(user.status == "inactive" || user.deleted == true){
    res.send({
      code: 400,
      messages: "Tài khoản đã khóa hoặc đã xóa!",
      flag: 3
    });
    return;
  }
  res.send({
    code: 200,
    messages: "Đăng nhập thành công!",
    flag: 4,
    token: user.tokenUser
  });
}

// Chua lam FE cho trang nay
// export const detail = async (req:Request, res:Response) => {
//   // console.log(req.params);
//   if(req.cookies.tokenUser){
//     const idUser = req.params.id;
//     if(idUser != res.locals.user.id){
//       req.flash("error", "Lỗi!");
//       res.redirect("/");
//     }
//     else{
//       res.render("client/pages/profile/index.pug", {
//         pageTitle: "Trang chi tiết tài khoản"
//       });
//     }
//   }
//   else
//     res.redirect("/user/login");
// }

export const editPatch = async (req:Request, res:Response) => {
  if(req.cookies.tokenUser) {
    const idUser = req.params.id;
    if(idUser != res.locals.user.id){
      req.flash("error", "Lỗi!");
      res.redirect("/");
    }
    else{
      const id = res.locals.user.id;
      await userModel.updateOne({
        _id: id
      }, req.body);
    }
    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
  }
  else {
    res.redirect("/user/login");
  }
}

export const changePassword = async (req:Request, res:Response) => {
  if(req.cookies.tokenUser){
    res.render("client/pages/profile/change-password.pug",{
      pageTitle: "Đổi mật khẩu"
    });
  }
  else{
    res.redirect("/user/login");
  }
}

let dataChangePassword = {
  passwordOld:String,
  passwordNew:String,
  passwordNewAgain:String
};

export const changePasswordPatch = async (req:Request, res:Response) => {
  if(req.cookies.tokenUser){
    const dataChangePassword = {passwordOld:String, passwordNew:String, passwordNewAgain:String} = req.body;
    if(dataChangePassword.passwordNew == ""){
      req.flash("error", "Lỗi!");
      res.redirect("/");
      return;
    }
    const user = res.locals.user;
    // console.log(passwordOld, passwordNew, passwordNewAgain);
    if(dataChangePassword.passwordNew != dataChangePassword.passwordNewAgain) {
      req.flash("error", "Mật khẩu mới không khớp!");
      res.redirect("back");
    }
    else if(md5(dataChangePassword.passwordOld) != user.password){
      req.flash("error", "Mật khẩu cũ không chính xác!");
      res.redirect("back");
    }
    else {
      const otp = generateRandomNumber(6);
      sendEmail(
        user.email,
        "Mã OTP THAY ĐỔI MẬT KHẨU.",
        `Mã xác thực của bạn là <b style ="color: green">${otp}</b>, có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã cho bất kì ai.`
      )
      const dataEmail = {
        email: user.email,
        otp: otp,
        expireAt: Date.now() + 3 * 60 * 1000
      };
  
      const data = new forgotPasswordModel(dataEmail);
      await data.save();
      res.redirect("/user/change-password/check-otp");
    }
  }
  else {
    res.redirect("/user/login");
  }
}

export const changePasswordCheckOtp = async (req:Request, res:Response) => {
  if(req.cookies.tokenUser){
    res.render("client/pages/profile/check-otp.pug", {
      pageTitle: "Xác thực otp"
    });
  }
  else{
    res.redirect("/user/login");
  }
}

export const changePasswordCheckOtpPatch = async (req:Request, res:Response) => {
  const user = res.locals.user;
  if(req.cookies.tokenUser){
    try {
      await userModel.updateOne({
        _id: user.id
      },{
        password: md5(dataChangePassword["passwordNew"])
      });
      req.flash("success", "Đổi mật khẩu thành công!");
      res.redirect(`/user/detail/${user.id}`);
    } catch (error) {
      req.flash("error", "Lỗi!");
      res.redirect("/");
    }
  }
  else{
    res.redirect("/user/login");
  }
}

export const logout = async (req:Request, res:Response) => {
  res.clearCookie("tokenUser");
  // res.clearCookie("cartId");
  res.redirect("/user/login");
}

export const forgotPassword = async (req:Request, res:Response) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu"
  });
}

export const forgotPasswordPost = async (req:Request, res:Response) => {
  const emailCurrent = await userModel.findOne({
    email: req.body.email,
    deleted: false
  });

  if(!emailCurrent){
    res.send({
      code: 400,
      messages: "Email không tồn tại trong hệ thống!"
    })
    return;
  }
  //Tao ma otp, gui otp ve mail user
  const otp = generateRandomNumber(6);

  sendEmail(
    emailCurrent.email,
    "Mã OTP LẤY LẠI MẬT KHẨU.",
    `Mã xác thực của bạn là <b style ="color: green">${otp}</b>, có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã cho bất kì ai.`
  )
  const dataEmail = {
    email: emailCurrent.email,
    otp: otp,
    expireAt: Date.now() + 3 * 60 * 1000
  };

  const data = new forgotPasswordModel(dataEmail);
  await data.save();
  
  const idUser = await userModel.findOne({
    email: dataEmail.email
  }).select("id");

  // res.cookie("idUser", idUser.id);
  res.send({
    idUser: idUser.id,
    email: emailCurrent.email
  })

  // res.send("ok");
  // res.redirect(`/user/password/check-otp?email=${emailCurrent.email}`);
}

export const checkOtp = async (req:Request, res:Response) => {
  const email = req.query.email;
  res.render("client/pages/user/check-otp.pug", {
    pageTitle: "Check otp",
    email: email
  });
}

let emailAuthen : String = "";

export const checkOtpPost = async (req:Request, res:Response) => {
  const {email, otp} = req.body;
  if(!otp || !email){
    res.send({
      code: 400,
      messages: "Thiếu thông tin dữ liệu!",
      flag: 0
    });
    return;
  }
  const otpReal = await forgotPasswordModel.findOne({
    email: email,
    otp: otp
  });

  if(!otpReal){
    res.send({
      code: 400,
      messages: "Mã otp không chính xác!",
      flag: 1
    })
    return;
  }
  emailAuthen = email;
  res.send({
    code: 200,
    messages: "Mã OTP hợp lệ!"
  })
}

export const resetPassword = async (req:Request, res:Response) => {
  // if(!req.cookies.otp){
  //   res.redirect("/user/password/forgot");
  //   return;
  // }
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Tạo lại mật khẩu mới"
  });
}

export const resetPasswordPatch = async (req:Request, res:Response) => {
  if(!req.body.idUser || !req.body.password || !req.body.email){
    res.send({
      code: 400,
      messages: "Thiếu dữ liệu",
      flag:0
    });
    return;
  }
  if(req.body.email != emailAuthen){
    res.send({
      flag: 1,
      messages: "Lỗi!"
    });
    return;
  }
  // console.log(req.body);
  try {
    const regexPass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g;
    const check = regexPass.test(req.body.password);
    if(!check){
      res.send({
        flag: 2,
        messages: "Mật khẩu không đúng định dạng!"
      })
      return;
    }
    const newPassword = md5(req.body.password);
    // console.log(newPassword);
    await userModel.updateOne({
      _id: req.body.idUser,
    }, {
      password: newPassword
    });
  
    const user = await userModel.findOne({
      _id: req.body.idUser,
    }).select("tokenUser");

    emailAuthen = "";
    res.send({
      code: 200,
      token: user.tokenUser,
      messages: "Mật khẩu của bạn đã được đổi!"
    })
  } catch (error) {
    emailAuthen = req.body.email;
    res.send("403");
  }
}

export const Password = async (req:Request, res:Response) => {
  // if(!req.cookies.otp){
  //   res.redirect("/user/password/forgot");
  //   return;
  // }
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Tạo lại mật khẩu mới"
  });
}
