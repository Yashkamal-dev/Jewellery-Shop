const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },

  customerEmail: {
    type: String,
    required: true,
  },

  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);

