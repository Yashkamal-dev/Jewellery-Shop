import React, { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Necklace");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);


  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `http://localhost:5000${imagePath}`;
  };


  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to load products."
        );

        return;
      }

      setProducts(data);

    } catch (error) {
      console.log(
        "FETCH PRODUCTS ERROR:",
        error
      );

      alert(
        "Server error. Please make sure the backend server is running."
      );
    }
  };


  // =========================================================
  // LOAD PRODUCTS WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, []);


  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";

      return;
    }

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };


  // =========================================================
  // UPLOAD IMAGE
  // =========================================================

  const uploadImage = async () => {
    if (!selectedImage) {
      return image;
    }

    const formData = new FormData();

    formData.append(
      "image",
      selectedImage
    );

    try {
      const response = await fetch(
        "/api/upload/image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Image upload failed."
        );

        return null;
      }

      return data.image;

    } catch (error) {
      console.log(
        "IMAGE UPLOAD ERROR:",
        error
      );

      alert(
        "Image upload failed. Please make sure the backend server is running."
      );

      return null;
    }
  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("Necklace");
    setDescription("");

    setImage("");
    setSelectedImage(null);
    setImagePreview("");

    setEditingId(null);

    const fileInput =
      document.getElementById(
        "product-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };


  // =========================================================
  // ADD / UPDATE PRODUCT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !price ||
      !description.trim()
    ) {
      alert(
        "Please fill all product details."
      );

      return;
    }

    setLoading(true);

    try {
      let finalImage = image;

      // Upload new image if selected
      if (selectedImage) {
        finalImage = await uploadImage();

        if (!finalImage) {
          setLoading(false);

          return;
        }
      }

      const productData = {
        name: name.trim(),
        price: Number(price),
        category,
        description: description.trim(),
        image: finalImage,
      };

      let response;

      // UPDATE
      if (editingId) {
        response = await fetch(
          `/api/products/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              productData
            ),
          }
        );
      }

      // ADD
      else {
        response = await fetch(
          "/api/products",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              productData
            ),
          }
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Something went wrong."
        );

        return;
      }

      if (editingId) {
        alert(
          "Product updated successfully."
        );
      } else {
        alert(
          "Product added successfully."
        );
      }

      resetForm();

      await fetchProducts();

    } catch (error) {
      console.log(
        "PRODUCT SAVE ERROR:",
        error
      );

      alert(
        "Server error. Please make sure the backend server is running."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setName(product.name || "");

    setPrice(
      product.price !== undefined
        ? product.price
        : ""
    );

    setCategory(
      product.category || "Necklace"
    );

    setDescription(
      product.description || ""
    );

    setImage(product.image || "");

    setSelectedImage(null);

    if (product.image) {
      setImagePreview(
        getImageUrl(product.image)
      );
    } else {
      setImagePreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to delete product."
        );

        return;
      }

      alert(
        "Product deleted successfully."
      );

      // If deleted product was being edited,
      // clear the form.
      if (editingId === id) {
        resetForm();
      }

      await fetchProducts();

    } catch (error) {
      console.log(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        "Server error while deleting product."
      );
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="admin-products-page">

      <div className="admin-products-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-products-header">

          <p className="admin-small-title">
            INVENTORY
          </p>

          <h1>
            {editingId
              ? "Update Product"
              : "Add Product"}
          </h1>

          <p>
            Manage your jewellery collection.
          </p>

        </div>


        {/* =================================================
            PRODUCT FORM
        ================================================= */}

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >

          {/* PRODUCT NAME */}

          <div className="form-group">

            <label>
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* PRICE */}

          <div className="form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              min="0"
              placeholder="Enter price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="Necklace">
                Necklace
              </option>

              <option value="Ring">
                Ring
              </option>

              <option value="Bracelet">
                Bracelet
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="4"
            />

          </div>


          {/* IMAGE */}

          <div className="form-group">

            <label htmlFor="product-image">
              Product Image
            </label>

            <input
              id="product-image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={
                handleImageChange
              }
            />

            <small>
              JPG, JPEG, PNG or WEBP -
              Maximum 5 MB
            </small>

          </div>


          {/* IMAGE PREVIEW */}

          {imagePreview && (

            <div className="image-preview-container">

              <p>
                Image Preview
              </p>

              <img
                src={imagePreview}
                alt="Product Preview"
                className="image-preview"
              />

            </div>

          )}


          {/* FORM BUTTONS */}

          <div className="product-form-buttons">

            <button
              type="submit"
              className="product-submit-button"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}

            </button>


            {/* CANCEL ONLY DURING UPDATE */}

            {editingId && (

              <button
                type="button"
                className="product-cancel-button"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </button>

            )}

          </div>

        </form>


        {/* =================================================
            ALL PRODUCTS
        ================================================= */}

        <div className="admin-product-list">

          <div className="admin-list-header">

            <p className="admin-small-title">
              INVENTORY
            </p>

            <h1>
              All Products
            </h1>

          </div>


          <div className="admin-product-grid">

            {products.length === 0 ? (

              <div className="no-products">

                <p>
                  No products found.
                </p>

              </div>

            ) : (

              products.map((item) => (

                <div
                  className="admin-product-card"
                  key={item._id}
                >

                  {/* PRODUCT IMAGE */}

                  <div className="admin-product-image">

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

                  <div className="admin-product-info">

                    <p className="product-category">
                      {item.category}
                    </p>

                    <h2>
                      {item.name}
                    </h2>

                    <p className="product-description">
                      {item.description}
                    </p>

                    <p className="product-price">
                      ₹{item.price}
                    </p>


                    {/* UPDATE + DELETE */}

                    <div className="admin-product-actions">

                      <button
                        type="button"
                        className="update-button"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminProducts;