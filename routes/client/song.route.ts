import express from "express";
const route = express.Router();

import * as controller from "../../controller/client/songs.controller";

route.get("/", controller.index);

route.get("/detail/:slugSong", controller.detail);


export const routeSong = route;
