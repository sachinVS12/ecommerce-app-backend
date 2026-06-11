// routes/admin/admin.user.routes.js
const express = require("express");
const router = express.Router();
const adminUserController = require("../../controllers/admin/admin.user.controller");
const { authMiddleware, isAdmin } = require("../../middleware/roleCheck");

router.use(authMiddleware, isAdmin);

router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getUserDetails);
router.put("/:id/role", adminUserController.updateUserRole);
router.post("/:id/block", adminUserController.blockUser);

module.exports = router;
