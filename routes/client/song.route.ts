import express  from "express";
const route = express.Router();
import {infoUser}  from "../../middlewares/client/user-middleware";

import * as controller from "../../controller/client/songs.controller";

// route.get("/", controller.index);

// route.get("/topics/:slug")

route.get("/detail/:slugSong", controller.detail);

route.get(`/love-songs`, infoUser, controller.loveSongs);

route.patch("/like", controller.like);

route.patch("/love", controller.love);

route.get("/search/:keyword", controller.search);

route.patch("/listen/:idSong", controller.listenNumberPatch);


export const routeSong = route;
