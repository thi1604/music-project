import express from "express";
import { routesClient } from "./index.route";
import * as controller from "../../controller/client/topics.controller";

const route = express.Router();


route.get("", controller.index);


export const routeTopics = route;
