import express  from "express";
const route = express.Router();

import * as controller from "../../controller/client/songs.controller";

route.get("/", controller.index);

route.get("/detail/:slugSong", controller.detail);

route.patch("/like", controller.like);


export const routeSong = route;
