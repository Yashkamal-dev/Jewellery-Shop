const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

const PORT = 5000;


/* =========================
   MIDDLEWARE
========================= */  

app.use(cors());

app.use(express.json());


/* =========================
   UPLOADED IMAGES
========================= */

app.use(
  "/uploads",
  express.static("uploads")
);


/* =========================
   API ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);


/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect("mongodb://127.0.0.1:27017/jewelleryStore")
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server is running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:");
    console.log(error);
  });