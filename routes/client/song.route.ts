import express from "express";
const route = express.Router();

import * as controller from "../../controller/client/songs.controller";

route.get("/", controller.index);


export const routeSong = route;
