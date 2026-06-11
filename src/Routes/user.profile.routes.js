// routes/user/user.profile.routes.js
const express = require("express");
const router = express.Router();
const userProfileController = require("../../controllers/user/user.profile.controller");
const { authMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);

router.get("/", userProfileController.getProfile);
router.put("/", userProfileController.updateProfile);
router.post("/change-password", userProfileController.changePassword);
router.get("/orders", userProfileController.getOrderHistory);

module.exports = router;
