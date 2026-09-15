import React, { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("PRODUCT FETCH ERROR:", error);
      });
  }, []);

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };

  const addToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? (user._id || user.id) : null;

    // If user is logged in, save cart to MongoDB
    if (userId) {
      try {
        const response = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            product: product,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          alert("Product added to cart");
        } else {
          alert(data.message || "Failed to add product to cart");
        }
      } catch (error) {
        console.log("ADD TO CART ERROR:", error);
        alert("Server error adding to cart");
      }
      return;
    }

    // Guest fallback (when not logged in)
    const oldCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = oldCart.find(
      (item) => item._id === product._id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = oldCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert("Product added to cart");
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <div className="products-page">

      {/* PAGE HEADER */}

      <div className="products-header">

        <p className="products-small-title">
          OUR COLLECTION
        </p>

        <h1>Jewellery Collection</h1>

        <p>
          Discover beautiful pieces crafted to add elegance
          to every occasion.
        </p>

      </div>


      {/* CATEGORY BUTTONS */}

      <div className="category-buttons">

        <button
          className={
            selectedCategory === "All"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedCategory("All")
          }
        >
          All
        </button>


        <button
          className={
            selectedCategory === "Necklace"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedCategory("Necklace")
          }
        >
          Necklaces
        </button>


        <button
          className={
            selectedCategory === "Ring"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedCategory("Ring")
          }
        >
          Rings
        </button>


        <button
          className={
            selectedCategory === "Bracelet"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedCategory("Bracelet")
          }
        >
          Bracelets
        </button>

      </div>


      {/* PRODUCTS */}

      <div className="product-grid">

        {filteredProducts.length === 0 ? (

          <div className="no-products">
            <p>No products found.</p>
          </div>

        ) : (

          filteredProducts.map((product) => (

            <div
              className="product-card"
              key={product._id}
            >

              {/* PRODUCT IMAGE */}

              <div className="product-image">

                {product.image ? (

                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                  />

                ) : (

                  <span>
                    No Image
                  </span>

                )}

              </div>


              {/* PRODUCT DETAILS */}

              <div className="product-info">

                <p className="product-category">
                  {product.category}
                </p>

                <h2>
                  {product.name}
                </h2>

                <p className="product-description">
                  {product.description}
                </p>

                <p className="product-price">
                  ₹{product.price}
                </p>


                <button
                  className="add-cart-button"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  Add to Cart
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Products;