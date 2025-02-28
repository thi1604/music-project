import express from "express";
const router = express.Router();
import * as controller from "../../controller/admin/trash.controller";

// product
router.get("/products", controller.indexProduct);

router.patch("/products/restore/:id", controller.restoreProduct);

router.delete("/products/permanently-deleted/:id", controller.permanentlyDeletedProduct);

router.patch("/products/change-many-item", controller.changeManyItemProduct);
// //End product


// role
router.get("/role", controller.indexRole);
router.patch("/roles/restore/:id", controller.restorePatch);
//End role

// topics
router.get("/topics", controller.indexTopics);
router.patch("/topics/restore/:id", controller.restoreTopic);
// //End role

// singers
router.get("/singers", controller.indexSingers);
router.patch("/singers/restore/:id", controller.restoreSingers);
// End singers

// // user
router.get("/users", controller.indexUsers);
router.patch("/users/restore/:id", controller.restoreUsers);
// //End user

// // account
router.get("/account", controller.indexAccount);
router.patch("/account/restore/:id", controller.restoreAccPatch);
// //End account

export const trashRoute = router;


