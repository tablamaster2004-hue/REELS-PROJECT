const mongoose = require("mongoose");

const sessionSchema2 = new mongoose.Schema(
    {
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "foodpartner",
            required: [true, "Foodpartner IS REQUIRED"]
        },
        refreshTokenHash: {
            type: String,
            required: [true, "REFRESH TOKEN HASH IS REQUIRED"]
        },
        ip: {
            type: String,
            required: [true, "IP IS REQUIRED"]
        },
        foodpartnerAgent: {
            type: String,
            required: [true, "FOOD PARTNER AGENT IS REQUIRED"]
        },
        revoked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const sessionModel2 = mongoose.model("session2", sessionSchema2);

module.exports = sessionModel2;