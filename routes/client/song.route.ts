import express  from "express";
const route = express.Router();

import * as controller from "../../controller/client/songs.controller";

// route.get("/", controller.index);

// route.get("/topics/:slug")

route.get("/detail/:slugSong", controller.detail);

route.patch("/like", controller.like);

route.patch("/love", controller.love);


export const routeSong = route;
