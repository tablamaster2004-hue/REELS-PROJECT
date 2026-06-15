const mongoose = require("mongoose");
const { type } = require("node:os");

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is Required"],
        unique: [true, "name must be Unique"]
    },
    contactName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
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

const foodPartnerModel = mongoose.model("foodpartner", foodPartnerSchema);

module.exports = foodPartnerModel;