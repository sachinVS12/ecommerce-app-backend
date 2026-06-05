// routes/cart.routes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authMiddleware } = require("../middleware/auth");

router.use(authMiddleware); // All cart routes require authentication
router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateCartItem);
router.delete("/remove/:productId", cartController.removeFromCart);

module.exports = router;
