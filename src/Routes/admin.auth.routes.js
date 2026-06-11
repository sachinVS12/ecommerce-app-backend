// routes/admin/admin.auth.routes.js
const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/admin.auth.controller");
const { authMiddleware, isAdmin } = require("../../middleware/roleCheck");

router.post("/login", adminAuthController.adminLogin);
router.post(
  "/logout",
  authMiddleware,
  isAdmin,
  adminAuthController.adminLogout,
);

module.exports = router;
