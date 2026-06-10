// controllers/admin/admin.dashboard.controller.js
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const Category = require("../../models/Category");

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - 7));
    const startOfMonth = new Date(now.setMonth(now.getMonth() - 1));

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get revenue stats
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    // Today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: { createdAt: { $gte: startOfToday } },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
    })
      .sort({ stock: 1 })
      .limit(10);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);

    // Monthly sales data for charts
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      stats: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          totalRevenue: revenueStats[0]?.totalRevenue || 0,
          avgOrderValue: revenueStats[0]?.avgOrderValue || 0,
        },
        today: {
          orders: todayOrders,
          revenue: todayRevenue[0]?.revenue || 0,
        },
        orderStatus: orderStatusBreakdown,
        recentOrders,
        lowStockProducts,
        topProducts,
        monthlySales,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSalesAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === "week") {
      dateFilter = {
        createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) },
      };
    } else if (period === "month") {
      dateFilter = {
        createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) },
      };
    } else if (period === "year") {
      dateFilter = {
        createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) },
      };
    }

    const analytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
