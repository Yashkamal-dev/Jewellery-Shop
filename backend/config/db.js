const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/jewelleryDB");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);
    }
};

module.exports = connectDB;