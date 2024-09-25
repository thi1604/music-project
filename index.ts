import express, {Express, Request, Response} from "express";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";
import {prefixAdmin} from "./config/system";
import {routesClient} from "./routes/client/index.route";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
dotenv.config();


const app : Express = express();
const port : number | string = process.env.PORT;
app.use(cookieParser('ThiBeo'));
app.use(express.static(`${__dirname}/public`)); // Nhung folder FE vao project

connectDatabase();

app.set("views", "./views");
app.set("view engine", "pug");

// parse application/json
app.use(bodyParser.json())
// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

//Nhung cac phuong thuc khac cho form(mac dinh form co get va post)
app.use(methodOverride('_method'));

routesClient(app);

app.listen(port, ()=> {
  console.log(`App listening on port ${port}`);
});
