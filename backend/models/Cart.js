const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      category: String,
      image: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
