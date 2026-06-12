// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/electronics_ecommerce",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Routes
const userAuthRoutes = require("./routes/user/user.auth.routes");
const userProductRoutes = require("./routes/user/user.product.routes");
const userCartRoutes = require("./routes/user/user.cart.routes");
const userOrderRoutes = require("./routes/user/user.order.routes");
const userProfileRoutes = require("./routes/user/user.profile.routes");

// Admin Routes
const adminAuthRoutes = require("./routes/admin/admin.auth.routes");
const adminDashboardRoutes = require("./routes/admin/admin.dashboard.routes");
const adminProductRoutes = require("./routes/admin/admin.product.routes");
const adminOrderRoutes = require("./routes/admin/admin.order.routes");
const adminUserRoutes = require("./routes/admin/admin.user.routes");
const adminCategoryRoutes = require("./routes/admin/admin.category.routes");

// Public routes (accessible by both)
const publicProductRoutes = require("./routes/public/product.routes");

// Use routes
app.use("/api/user/auth", userAuthRoutes);
app.use("/api/user/products", userProductRoutes);
app.use("/api/user/cart", userCartRoutes);
app.use("/api/user/orders", userOrderRoutes);
app.use("/api/user/profile", userProfileRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);

// Public routes
app.use("/api/products", publicProductRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`User API: http://localhost:${PORT}/api/user`);
  console.log(`Admin API: http://localhost:${PORT}/api/admin`);
});
