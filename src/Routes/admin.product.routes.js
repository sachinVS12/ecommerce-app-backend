// routes/admin/admin.product.routes.js
const express = require("express");
const router = express.Router();
const adminProductController = require("../../controllers/admin/admin.product.controller");
const { authMiddleware, isAdmin } = require("../../middleware/roleCheck");

router.use(authMiddleware, isAdmin);

router.get("/", adminProductController.getAllProducts);
router.post("/", adminProductController.createProduct);
router.put("/:id", adminProductController.updateProduct);
router.delete("/:id", adminProductController.deleteProduct);
router.post("/bulk-stock", adminProductController.bulkUpdateStock);

module.exports = router;
