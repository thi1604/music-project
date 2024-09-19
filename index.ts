import express, {Express, Request, Response} from "express";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";
import {prefixAdmin} from "./config/system";
import {routesClient} from "./routes/client/index.route";


dotenv.config();


const app : Express = express();
const port : number | string = process.env.PORT;
app.use(express.static(`${__dirname}/public`)); // Nhung folder FE vao project

connectDatabase();

app.set("views", "./views");
app.set("view engine", "pug");


routesClient(app);

app.listen(port, ()=> {
  console.log(`App listening on port ${port}`);
});
