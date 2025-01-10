const mongoose = require("mongoose");

export const connect = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Ket noi database thanh cong!");
  }catch(error){
    console.log("Ket noi database that bai!");
  }
};

