const mongoose = require("mongoose");

// UfEXGgZlpbRdEZoU

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;