const foodPartnerModel = require("../model/FOODPARTNER/foodpartner.model")
const userModel = require("../model/USER/user.model")
const jwt = require("jsonwebtoken")
const config = require("../config/config");


async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
        return res.status(401).json({
            message: "PLEASE LOGIN FIRST"
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const foodPartner = await foodPartnerModel.findById(decoded.id)

        req.foodPartner = foodPartner

        next()
    }
    catch (err) {

        return res.status(401).json({
            message: "TOKEN EXPIRED OR INVALID"
        });
    }

}

async function authUserMiddleware(req, res, next) {
    // console.log("HEADERS:", req.headers);
    // console.log("AUTH:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "PLEASE LOGIN FIRST"
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        // console.log("DECODED:", decoded);

        const user = await userModel.findById(decoded.id)
        // console.log("USER:", user);

        if (!user) {
            return res.status(401).json({
                message: "USER NOT FOUND"
            });
        }
        // console.log("USER:", user);

        req.user = user

        next()
    }
    catch (err) {
        // console.log("JWT ERROR:", err.message);
        return res.status(401).json({
            message: "TOKEN EXPIRED OR INVALID"
        });
    }
}

async function authAnyMiddleware(req, res, next) {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "PLEASE LOGIN FIRST"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            config.JWT_SECRET
        );

        const user = await userModel.findById(decoded.id);
        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!user && !foodPartner) {
            return res.status(401).json({
                message: "ACCOUNT NOT FOUND"
            });
        }

        req.user = user || null;
        req.foodPartner = foodPartner || null;



        next();
    } catch (err) {

        return res.status(401).json({
            message: "TOKEN EXPIRED OR INVALID"
        });
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    authAnyMiddleware
}

