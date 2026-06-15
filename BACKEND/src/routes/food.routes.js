const express = require("express");
const foodRouter = express.Router();
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middleware/auth.middleware")
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage()
})

// NOW IN THIS ROUTE THE PATHS WILL BE PROTECTED WHICH MEANS ONLY THE FOODPARTNER WILL  ACCESS HESE ROUTES NO ONE ELSE . SO TO ACHIEVE THIS WE WILL CREATE A MIDDLEWARE WHICH WILL PERFORM THIS TASK FOR US

// post/api/food/    //AS I HAVE USED THE MIDDLEWARE SO THIS API IS PROTECTED NOW SO IN ORDER TO  PROTECT AN API WE USE MIDDLEWARE
foodRouter.post('/', authMiddleware.authFoodPartnerMiddleware, upload.single("video1"), foodController.createFood)

// get/api/food/ 
// foodRouter.get('/',authMiddleware.authUserMiddleware,foodController.getFoodItem)  //this willl bring all the food item data to the app so that the user will get a semeless experiance while scrolling
foodRouter.get(
    '/',
    foodController.getFoodItem
)

foodRouter.post('/like', authMiddleware.authUserMiddleware, foodController.likeFood)
foodRouter.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood)
foodRouter.get(
    '/saved',
    authMiddleware.authUserMiddleware,
    foodController.getSavedFoods
)

module.exports = foodRouter