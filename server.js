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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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

// Routes
const authroutes = require("./Routes/auth.routes");
const productRoutes = require("./Routes/product.routes");
const cartRoutes = require("./Routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");

app.use("/api/auth", authroutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
