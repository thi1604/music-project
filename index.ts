import express, {Express, Request, Response} from "express";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();
const port : number = 3000;


connectDatabase();

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/topics", (req: Request, res: Response) => {
  res.render("client/pages/topics/index.pug");
});

app.listen(port, ()=> {
  console.log(`App listening on port ${port}`);
});
