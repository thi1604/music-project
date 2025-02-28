import express from "express";
const router = express.Router();
import * as controller from "../../controller/admin/roles.controller";


router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

router.get("/detail/:id", controller.detail);

router.patch("/delete/:id", controller.deleteItem);

export const rolesAdmin = router;