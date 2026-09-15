const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// =========================================================
// 1. GET USER CART
// =========================================================
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.json({ userId: req.params.userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// =========================================================
// 2. ADD PRODUCT TO CART
// =========================================================
router.post("/add", async (req, res) => {
  try {
    const { userId, product } = req.body;

    if (!userId || !product) {
      return res.status(400).json({ message: "User ID and product are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if product is already in the cart
    const existingIndex = cart.items.findIndex(
      (item) => String(item._id) === String(product._id)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({
        _id: String(product._id),
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        quantity: 1,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// =========================================================
// 3. UPDATE / SAVE CART ITEMS
// =========================================================
router.put("/:userId", async (req, res) => {
  try {
    const { items } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items: items || [] },
      { returnDocument: "after", upsert: true }
    );

    res.json(cart);
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// =========================================================
// 4. CLEAR CART (After placing order)
// =========================================================
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items: [] }
    );

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.log("CLEAR CART ERROR:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

module.exports = router;
