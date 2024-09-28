import express from "express";
const route = express.Router();
import * as controller from "../../controller/admin/dashBoard.controller";

route.get("", controller.index);

export const routeDashBoard = route;