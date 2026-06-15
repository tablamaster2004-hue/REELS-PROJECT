const express = require('express')
const foodPartnerController = require('../controllers/food-partner.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()


//get / api / food - partner /: id
router.get("/:id",
    authMiddleware.authAnyMiddleware,
    foodPartnerController.getFoodPartnerById
)



module.exports = router