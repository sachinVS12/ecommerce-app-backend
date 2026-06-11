// routes/user/user.cart.routes.js
const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/user/user.cart.controller");
const { authMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCartItem);
router.delete("/remove/:productId", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
