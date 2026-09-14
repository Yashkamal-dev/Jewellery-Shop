const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadFolder = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },

  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);

    const fileName =
      Date.now() + "-" + Math.round(Math.random() * 100000) + extension;

    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpg|jpeg|png|webp/;

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image",
      });
    }

    const imageUrl = "/uploads/" + req.file.filename;

    res.status(200).json({
      message: "Image uploaded successfully",
      image: imageUrl,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Image upload failed",
    });
  }
});

module.exports = router;