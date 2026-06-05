// controllers/cart.controller.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product",
      "name price images",
    );

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product", "name price images");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product", "name price images");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate("items.product", "name price images");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
