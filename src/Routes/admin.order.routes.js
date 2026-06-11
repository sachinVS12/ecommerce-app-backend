// routes/admin/admin.order.routes.js
const express = require("express");
const router = express.Router();
const adminOrderController = require("../../controllers/admin/admin.order.controller");
const { authMiddleware, isAdmin } = require("../../middleware/roleCheck");

router.use(authMiddleware, isAdmin);

router.get("/", adminOrderController.getAllOrders);
router.get("/:id", adminOrderController.getOrderDetails);
router.put("/:id/status", adminOrderController.updateOrderStatus);
router.put("/:id/payment", adminOrderController.updatePaymentStatus);
router.post("/:id/cancel", adminOrderController.cancelOrder);

module.exports = router;
