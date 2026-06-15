const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is Required"],
        unique: [true, "Username must be Unique"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "Email must be Unique"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;