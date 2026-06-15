const { request } = require("node:http")
const foodModel = require("../model/FOODPARTNER/food_item.model")
const storageService = require("../services/storage.service")
const { v4: uuid } = require("uuid")
const likeModel = require('../model/likes.model')
const saveModel = require('../model/save.model')


async function createFood(req, res) {    //WE CANT STORE THE VIDEOS IN THE SERVER IT IS NOT GOOD SO WE WILL USE A CLOULD STORAGE PROVIDER
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())
    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "FOOD CREATED SUCCESSFULLY",
        food: foodItem
    })
}

async function getFoodItem(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "FOOD ITEMS FETCHED SUCCESSFULLY",
        foodItems
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadyLiked = await likeModel.findOne({
        user: req.user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: req.user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "FOOD UNLIKED SUCCESSFULLY",
            liked: false
        })
    }
    const like = await likeModel.create({
        user: req.user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "FOOD LIKED SUCCESSFULLY",
        liked: true,
        like

    })

}

async function saveFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        user: req.user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: req.user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { saveCount: -1 }
        })

        return res.status(200).json({
            message: "FOOD UNSAVED SUCCESSFULLY",
            saved: false
        })
    }
    const save = await saveModel.create({
        user: req.user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { saveCount: 1 }
    })

    res.status(201).json({
        message: "FOOD SAVED SUCCESSFULLY",
        saved: true,
        save
    })
}

async function getSavedFoods(req, res) {
    try {
        const savedFoods = await saveModel
            .find({
                user: req.user._id
            })
            .populate("food");

        res.status(200).json({
            message: "SAVED FOODS FETCHED SUCCESSFULLY",
            savedFoods
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    createFood,
    getFoodItem,
    likeFood,
    saveFood,
    getSavedFoods
}