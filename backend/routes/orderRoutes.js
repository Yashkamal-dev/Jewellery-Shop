const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);

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
    const orders = await Order.find();

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