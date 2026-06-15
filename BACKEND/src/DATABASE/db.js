const mongoose = require("mongoose");
const config = require("../config/config.js");


const connectDB = async () => {
  await mongoose.connect(config.MONGO_URI);
  console.log("CONNECTED TO DATABASE");
};

module.exports = connectDB;