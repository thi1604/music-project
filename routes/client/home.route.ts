import express  from "express";
const route = express.Router();

import * as controller from "../../controller/client/home.controller";


route.get("", controller.index);


export const routeHome = route;