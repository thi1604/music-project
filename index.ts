import express, {Express, Request, Response} from "express";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";
import {prefixAdmin} from "./config/system";
import {routesClient} from "./routes/client/index.route";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();


const app : Express = express();
const port : number | string = process.env.PORT;
app.use(cookieParser('ThiBeo'));
app.use(express.static(`${__dirname}/public`)); // Nhung folder FE vao project

connectDatabase();

app.set("views", "./views");
app.set("view engine", "pug");

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

routesClient(app);

app.listen(port, ()=> {
  console.log(`App listening on port ${port}`);
});
