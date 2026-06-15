const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is Required"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: [true, "User is Required"]
        },
        otpHash: {
            type: String,
            required: [true, "User is Required"]
        }
    },
    {
        timestamps: true
    }
);

const otpModel = mongoose.model("user_otps", otpSchema);

module.exports = otpModel;