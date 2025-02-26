import express  from "express";
const route = express.Router();
import {infoUser}  from "../../middlewares/client/user-middleware";

import * as controller from "../../controller/client/songs.controller";

// route.get("/", controller.index);

// route.get("/topics/:slug")

route.get("/detail/:slugSong", controller.detail);

route.get("/topSongs", controller.topSongs);

route.patch(`/love-songs`, infoUser, controller.loveSongs);

route.patch("/like", controller.like);

route.patch("/love", infoUser, controller.love);

route.patch("/check-love-song", controller.checkLoveSong);

route.get("/search/:keyword", controller.search);

route.patch("/random", controller.randomSong);

// route.patch("/randomLogin", infoUser, controller.randomSongLogin)

route.patch("/listen/:slugSong", controller.listenNumberPatch);


export const routeSong = route;
