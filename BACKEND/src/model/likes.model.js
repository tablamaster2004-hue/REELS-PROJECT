const mongoose = require("mongoose")
const { type } = require("node:os")
const { ref } = require("node:process")

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }
}, { timestamps: true })

const Like = mongoose.model('like', likeSchema)
module.exports = Like