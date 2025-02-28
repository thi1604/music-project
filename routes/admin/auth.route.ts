import express from "express";
const router = express.Router();
import * as controller from "../../controller/admin/auth.controller";

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logOut);

export const routeAuth = router;