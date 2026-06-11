// routes/user/user.auth.routes.js
const express = require("express");
const router = express.Router();
const userAuthController = require("../../controllers/user/user.auth.controller");
const { authMiddleware } = require("../../middleware/auth");

router.post("/register", userAuthController.userRegister);
router.post("/login", userAuthController.userLogin);
router.get("/me", authMiddleware, userAuthController.getCurrentUser);

module.exports = router;
