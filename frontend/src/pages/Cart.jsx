import React, { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // =========================================================
  // LOAD CART
  // =========================================================

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  };


  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://localhost:5000${image}`;
  };


  // =========================================================
  // UPDATE CART
  // =========================================================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };


  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(updatedCart);
  };


  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };


  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    updateCart(updatedCart);
  };


  // =========================================================
  // TOTAL
  // =========================================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );


  // =========================================================
  // PLACE ORDER
  // =========================================================

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (
      !customerName.trim() ||
      !customerEmail.trim()
    ) {
      alert(
        "Please enter your name and email"
      );

      return;
    }

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customerName:
              customerName.trim(),

            customerEmail:
              customerEmail.trim(),

            products: cart.map((item) => ({
              productId: item._id,
              name: item.name,
              price: Number(item.price),
              quantity: Number(
                item.quantity
              ),
            })),

            totalAmount: total,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        alert(
          "Order placed successfully!"
        );

        localStorage.removeItem(
          "cart"
        );

        setCart([]);

        setCustomerName("");

        setCustomerEmail("");
      } else {
        alert(
          data.message ||
            "Failed to place order"
        );
      }

    } catch (error) {
      console.log(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        "Something went wrong. Please make sure the backend server is running."
      );
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="cart-page">

      {/* =================================================
          CART HEADER
      ================================================= */}

      <div className="cart-header">

        <p>
          YOUR SELECTION
        </p>

        <h1>
          Shopping Cart
        </h1>

      </div>


      {/* =================================================
          EMPTY CART
      ================================================= */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <h2>
            Your Cart is Empty
          </h2>

          <p>
            Add some beautiful jewellery
            to your cart.
          </p>

        </div>

      ) : (

        /* =================================================
           CART CONTENT
        ================================================= */

        <div className="cart-layout">


          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item._id}
              >


                {/* PRODUCT IMAGE */}

                <div className="cart-item-image">

                  {item.image ? (

                    <img
                      src={getImageUrl(
                        item.image
                      )}
                      alt={item.name}
                    />

                  ) : (

                    <span>
                      No Image
                    </span>

                  )}

                </div>


                {/* PRODUCT DETAILS */}

                <div className="cart-item-details">

                  <p className="cart-category">
                    {item.category}
                  </p>

                  <h2>
                    {item.name}
                  </h2>

                  <p className="cart-price">
                    ₹{item.price}
                  </p>


                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item._id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item._id
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeItem(
                        item._id
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div className="order-summary">

            <h2>
              Order Summary
            </h2>


            {/* ITEMS COUNT */}

            <div className="summary-line">

              <span>
                Items
              </span>

              <span>
                {cart.length}
              </span>

            </div>


            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total
              </span>

              <span>
                ₹{total}
              </span>

            </div>


            {/* CUSTOMER DETAILS */}

            <h3>
              Customer Details
            </h3>


            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
            />


            <input
              type="email"
              placeholder="Your Email"
              value={customerEmail}
              onChange={(e) =>
                setCustomerEmail(
                  e.target.value
                )
              }
            />


            {/* PLACE ORDER */}

            <button
              type="button"
              className="place-order-button"
              onClick={placeOrder}
            >
              Place Order
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;