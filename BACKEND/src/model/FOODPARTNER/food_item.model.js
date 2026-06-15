const mongoose = require('mongoose')
const { type } = require('node:os')
const { stringify } = require('node:querystring')

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,   // string becauce we will store the url of the video
        required: true
    },
    description: {
        type: String
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    saveCount: {
        type: Number,
        default: 0
    }
})

const foodModel = mongoose.model("food", foodSchema)

module.exports = foodModel