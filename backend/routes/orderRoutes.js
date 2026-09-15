const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { userId, customerName, customerEmail, products, totalAmount } = req.body;

    // Create snapshot of ordered products so cart changes never affect orders
    const orderedProducts = Array.isArray(products)
      ? products.map((item) => ({
          productId: String(item.productId || item._id || ""),
          name: item.name || "Product",
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }))
      : [];

    const order = await Order.create({
      userId: userId || "",
      customerName,
      customerEmail,
      products: orderedProducts,
      totalAmount: Number(totalAmount) || 0,
      orderDate: new Date(),
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
});

module.exports = router;