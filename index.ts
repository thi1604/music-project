import express, {Express, Request, Response} from "express";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";
import {prefixAdmin} from "./config/system";
import {routesClient} from "./routes/client/index.route";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import session from "express-session";
import flash from "express-flash";

dotenv.config();

const app : Express = express();
const port : number | string = process.env.PORT;
app.use(cookieParser('ThiBeo'));
app.use(express.static(`${__dirname}/public`)); // Nhung folder FE vao project

connectDatabase();

app.set("views", "./views");
app.set("view engine", "pug");

// Nhung flash
app.use(session({
  secret: 'keyboard cat',            // Chuỗi dùng để ký session ID
  resave: false,                    // Không lưu session nếu không có thay đổi
  saveUninitialized: false,         // Chỉ lưu session khi có dữ liệu
  cookie: { maxAge: 60000 }         // Không yêu cầu HTTPS cho cookie (chỉ dùng cho môi trường phát triển)
}));

declare global {
  namespace Express {
    interface Request {
      flash(messageType: string, message?: string): void;
      flash(messageType: string): string[];
    }
  }
}

app.use(flash());
// End Nhung flash

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
