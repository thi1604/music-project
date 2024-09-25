import express from "express";
import * as controller from "../../controller/client/topics.controller";

const route = express.Router();


route.get("", controller.index);

route.get("/:slugTopic", controller.songsInTopic)

export const routeTopics = route;
