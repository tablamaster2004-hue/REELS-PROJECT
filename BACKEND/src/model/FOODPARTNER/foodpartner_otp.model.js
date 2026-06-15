const mongoose = require("mongoose");

const otpSchema2 = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is Required"]
        },
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "name",
            required: [true, "FOODPARTNER NAME is Required"]
        },
        otpHash: {
            type: String,
            required: [true, "OTP is Required"]
        }
    },
    {
        timestamps: true
    }
);

const otpModel2 = mongoose.model("foodPartner_otps", otpSchema2);

module.exports = otpModel2;