export const generateRandomString = (length:number)=>{
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result: String = "";
  let n = characters["length"];
  for(let i:number = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * n));
  }
  return result;
}

export const generateRandomNumber = (length:number)=>{
  const characters = "0123456789";

  let result: String = "";
  let n = characters.length;
  for(let i:number = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * n));
  }
  return result;
}