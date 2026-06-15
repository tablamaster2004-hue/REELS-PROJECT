const foodPartnerModel = require("../model/FOODPARTNER/foodpartner.model")
const foodModel = require("../model/FOODPARTNER/food_item.model")
const mongoose = require("mongoose");

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id

    const allPartners = await foodPartnerModel.find();


    const foodPartner = await foodPartnerModel.findById(foodPartnerId)

    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({
            message: "FOOD PARTNER NOT FOUND"
        })
    }

    res.status(200).json({
        message: "FOOD PARTNER RETRIVED SUCCESSFULLY",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }

    })

}

module.exports = {
    getFoodPartnerById
}