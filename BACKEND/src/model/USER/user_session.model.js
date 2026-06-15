const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "USER IS REQUIRED"]
        },
        refreshTokenHash: {
            type: String,
            required: [true, "REFRESH TOKEN HASH IS REQUIRED"]
        },
        ip: {
            type: String,
            required: [true, "IP IS REQUIRED"]
        },
        userAgent: {
            type: String,
            required: [true, "USER AGENT IS REQUIRED"]
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

const sessionModel = mongoose.model("session", sessionSchema);

module.exports = sessionModel;