import express from "express";
import * as controller from "../../controller/client/singer.controller";

const router = express.Router();

router.get("/", controller.index);


export const routerSinger = router;