// routes/user/user.order.routes.js
const express = require("express");
const router = express.Router();
const userOrderController = require("../../controllers/user/user.order.controller");
const { authMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);

router.post("/", userOrderController.createOrder);
router.get("/", userOrderController.getMyOrders);
router.get("/:id", userOrderController.getOrderDetails);
router.post("/:id/cancel", userOrderController.cancelOrder);

module.exports = router;
