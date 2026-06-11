// routes/admin/admin.dashboard.routes.js
const express = require("express");
const router = express.Router();
const adminDashboardController = require("../../controllers/admin/admin.dashboard.controller");
const { authMiddleware, isAdmin } = require("../../middleware/roleCheck");

router.use(authMiddleware, isAdmin);

router.get("/stats", adminDashboardController.getDashboardStats);
router.get("/analytics", adminDashboardController.getSalesAnalytics);

module.exports = router;
