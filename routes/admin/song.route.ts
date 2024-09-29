import express from "express";
import * as controller from "../../controller/admin/song,controller";

const route = express.Router();

route.get("", controller.index);

route.get("/create", controller.create);

export const routeSong = route;