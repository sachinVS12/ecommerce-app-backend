// middleware/roleCheck.js
const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${roles.join(" or ")} role required.`,
      });
    }

    next();
  };
};

const isAdmin = roleCheck("admin");
const isUser = roleCheck("user", "admin");

module.exports = { roleCheck, isAdmin, isUser };
