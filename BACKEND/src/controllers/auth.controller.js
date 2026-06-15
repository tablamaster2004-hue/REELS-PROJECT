const userModel = require("../model/USER/user.model.js");
const foodPartnerModel = require("../model/FOODPARTNER/foodpartner.model.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const sessionModel = require("../model/USER/user_session.model.js");
const sessionModel2 = require("../model/FOODPARTNER/foodpartner_session.model.js");
const { sendEmail } = require("../services/email.service");
const { generateOtp, getOtpHtml } = require("../utils/util");
const otpModel = require("../model/USER/user_otp.model.js");
const otpModel2 = require("../model/FOODPARTNER/foodpartner_otp.model.js");



async function register_user(req, res) {
    const { username, email, password } = req.body//these are the data that we will get from the user when they will register  and will be stored in the req.body
    //password is never stored in the text format in the database .it is stored in the hashed format so wiwll use crypto module.
    const isAlreadyregistered = await userModel.findOne({

        $or: [
            { username },
            { email }
        ]
    })
    if (isAlreadyregistered) {
        return res.status(409).json({     //409 is the status of conflict which means the user is already registered
            message: "Username or Email already exists"  //message is used during login or registration
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")//this is the way to hash the password using crypto module


    const user = new userModel({   //WHEN WE USE NEW THE MONGOOSE SESSION IS CREATED BUT OT SAVED IN MONGODB UNTIL WE CALL THE SAVE METHOD
        username,
        email,
        password: hashedPassword
    })
    await user.save();   //HERE WE SAVE THE METHORD

    const otp = generateOtp()
    const html = getOtpHtml(otp)

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")
    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })

    await sendEmail(email, "OTP CERIFICATION", `Your OTP is ${otp}`, html)


    res.status(201).json({   //201 is the status of created which means the user is successfully registered
        message: "User registered successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        },
    })

}

async function logIn_user(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "Invalid Email or Password"
        })
    }
    if (!user.verified) {
        return res.status(401).json({
            message: "Email is not Verified"
        })
    }


    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    const isPasswordValid = hashedPassword === user.password

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "invalid Password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        ip: req.ip,
        userAgent: req.header("user-Agent"),
        refreshTokenHash
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    res.status(200).json({
        message: "LOGGED IN SUCCESSFULLY",
        user: {
            username: user.username,
            email: user.email
        },
        accessToken
    })

}

async function getMe_user(req, res) {

    const token = req.headers.authorization?.split(" ")[1] //this is the way to get the token from the header and split it to get the token only
    if (!token) {
        return res.status(401).json({   //401 is the status of unauthorized which means the user is not logged in
            message: "TOKEN NOT FOUND"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) //this is the way to verify the token using jwt module and get the decoded data from the token


    const user = await userModel.findById(decoded.id) //this is the way to find the user by id using the decoded data from the token


    res.status(200).json({   //200 is the status of ok which means the user is successfully logged in
        message: "User fetched successfully",
        user: {
            username: user.username,
            email: user.email
        }
    })
}

async function refreshToken_user(req, res) {
    const refreshToken = req.cookies.refreshToken //this is the way to get the refresh token from the cookie
    if (!refreshToken) {
        return res.status(401).json({   //401 is the status of unauthorized which means the user is not logged in
            message: "REFRESH TOKEN NOT FOUND"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET) //this is the way to verify the refresh token using jwt module and get the decoded data from the refresh token

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex") //this is the way to hash the refresh token using crypto module

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })    //this is the way to find the session by refresh token hash

    if (!session) {
        return res.status(401).json({   //401 is the status of unauthorized which means the user is not logged in
            message: "INVALID REFRESH TOKEN"
        })
    }

    const accessToken = jwt.sign(
        {
            id: decoded.id
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
    const newRefreshToken = jwt.sign(
        {
            id: decoded.id
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex") //this is the way to hash the new refresh token using crypto module 
    session.refreshTokenHash = newRefreshTokenHash //this is the way to update the refresh token hash in the session
    await session.save() //this is the way to save the session after updating the refresh token hash

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    res.status(200).json({   //200 is the status of ok which means the access token is successfully refreshed
        message: "Access token refreshed successfully",
        accessToken
    })
}

async function logout_user(req, res) {
    const refreshToken = req.cookies.refreshToken //this is the way to get the refresh token from the cookie
    if (!refreshToken) {    //CHECKING IF THE REFRESH TOKEN IS NOT PRESENT IN THE COOKIE OR NOT
        return res.status(400).json({   //400 is the status of bad request which means the request is invalid
            message: "REFRESH TOKEN NOT FOUND"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex") //this is the way to hash the refresh token using crypto module

    const session = await sessionModel.findOne(    //this is the way to find the session by refresh token hash

        { refreshTokenHash },
        { revoked: false } //this is the way to check if the session is not revoked) 
    )
    if (!session) {    //CHECKING IF THE SESSION IS NOT PRESENT IN THE DATABASE OR NOT
        return res.status(400).json({   //400 is the status of bad request which means the request is invalid
            message: "INVALID REFRESH TOKEN"
        })
    }

    session.revoked = true //this is the way to revoke the session by setting the revoked field to true 
    await session.save() //this is the way to save the session after revoking it

    res.clearCookie("refreshToken") //this is the way to clear the refresh token from the cookie
    res.status(200).json({   //200 is the status of ok which means the user is successfully logged out
        message: "User logged out successfully"
    })
}


async function verifyEmail_user(req, res) {
    const { otp, email } = req.body

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if (!otpDoc) {
        return res.status(400).json({
            message: "INVALID OTP"
        })
    }

    const user = await userModel.findByIdAndUpdate(
        otpDoc.user,
        {
            verified: true
        },
        {
            new: true
        }
    )

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    return res.status(200).json({
        message: "User Verified Successfully",
        user: {

            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })
}


async function register_foodPartner(req, res) {
    const { name, email, password, address, contactName } = req.body//these are the data that we will get from the user when they will register  and will be stored in the req.body
    //password is never stored in the text format in the database .it is stored in the hashed format so wiwll use crypto module.
    const isAlreadyregistered = await foodPartnerModel.findOne({

        $or: [
            { name },
            { email }
        ]
    })
    if (isAlreadyregistered) {
        return res.status(409).json({     //409 is the status of conflict which means the user is already registered
            message: "FOOD PARTNER ACCOUNT already exists"  //message is used during login or registration
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")//this is the way to hash the password using crypto module


    const foodPartner = new foodPartnerModel({   //WHEN WE USE NEW THE MONGOOSE SESSION IS CREATED BUT OT SAVED IN MONGODB UNTIL WE CALL THE SAVE METHOD
        name,
        email,
        password: hashedPassword,
        address,
        contactName
    })
    await foodPartner.save();   //HERE WE SAVE THE METHORD

    const otp = generateOtp()
    const html = getOtpHtml(otp)

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")
    await otpModel2.create({
        email,
        foodPartner: foodPartner._id,
        otpHash
    })

    await sendEmail(email, "OTP CERIFICATION", `Your OTP is ${otp}`, html)


    res.status(201).json({   //201 is the status of created which means the user is successfully registered
        message: "FOOD PARTNER registered Successfully",
        foodPartner: {
            name: foodPartner.name,
            email: foodPartner.email,
            verified: foodPartner.verified,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName
        },
    })
}

async function logIn_foodPartner(req, res) {
    const { email, password } = req.body
    const foodPartner = await foodPartnerModel.findOne({ email })

    if (!foodPartner) {
        return res.status(401).json({
            message: "Invalid Email or Password"
        })
    }
    if (!foodPartner.verified) {
        return res.status(401).json({
            message: "Email is not Verified"
        })
    }


    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    const isPasswordValid = hashedPassword === foodPartner.password

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "invalid Password"
        })
    }

    const refreshToken = jwt.sign({
        id: foodPartner._id,
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        })
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel2.create({
        foodPartner: foodPartner._id,
        ip: req.ip,
        foodpartnerAgent: foodPartner,
        refreshTokenHash
    })

    const accessToken = jwt.sign({
        id: foodPartner._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    res.status(200).json({
        message: "LOGGED IN SUCCESSFULLY",
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.username,
            email: foodPartner.email,
            address: foodPartner.address,
            contactName: foodPartner.contactName
        },
        accessToken
    })
}

async function getMe_foodPartner(req, res) {

    const token = req.headers.authorization?.split(" ")[1] //this is the way to get the token from the header and split it to get the token only
    if (!token) {
        return res.status(401).json({   //401 is the status of unauthorized which means the user is not logged in
            message: "TOKEN NOT FOUND"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) //this is the way to verify the token using jwt module and get the decoded data from the token


    const foodPartner = await foodPartnerModel.findById(decoded.id) //this is the way to find the user by id using the decoded data from the token


    res.status(200).json({   //200 is the status of ok which means the user is successfully logged in
        message: "User fetched successfully",
        foodPartner: {
            name: foodPartner.username,
            email: foodPartner.email
        }
    })
}

async function refreshToken_foodPartner(req, res) {
    const refreshToken = req.cookies.refreshToken //this is the way to get the refresh token from the cookie
    if (!refreshToken) {
        return res.status(401).json({   //401 is the status of unauthorized which means the user is not logged in
            message: "REFRESH TOKEN NOT FOUND"
        })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET) //this is the way to verify the refresh token using jwt module and get the decoded data from the refresh token

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex") //this is the way to hash the refresh token using crypto module

    const session = await sessionModel2.findOne({
        refreshTokenHash,
        revoked: false
    })    //this is the way to find the session by refresh token hash

    if (!session) {
        return res.status(401).json({   //401 is the status of unauthorized which means the user is not logged in
            message: "INVALID REFRESH TOKEN"
        })
    }

    const accessToken = jwt.sign(
        {
            id: decoded.id
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )
    const newRefreshToken = jwt.sign(
        {
            id: decoded.id
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex") //this is the way to hash the new refresh token using crypto module 
    session.refreshTokenHash = newRefreshTokenHash //this is the way to update the refresh token hash in the session
    await session.save() //this is the way to save the session after updating the refresh token hash

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    res.status(200).json({   //200 is the status of ok which means the access token is successfully refreshed
        message: "Access token refreshed successfully",
        accessToken
    })
}

async function logout_foodPartner(req, res) {
    const refreshToken = req.cookies.refreshToken //this is the way to get the refresh token from the cookie
    if (!refreshToken) {    //CHECKING IF THE REFRESH TOKEN IS NOT PRESENT IN THE COOKIE OR NOT
        return res.status(400).json({   //400 is the status of bad request which means the request is invalid
            message: "REFRESH TOKEN NOT FOUND"
        })
    }
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex") //this is the way to hash the refresh token using crypto module

    const session = await sessionModel2.findOne(    //this is the way to find the session by refresh token hash

        { refreshTokenHash },
        { revoked: false } //this is the way to check if the session is not revoked) 
    )
    if (!session) {    //CHECKING IF THE SESSION IS NOT PRESENT IN THE DATABASE OR NOT
        return res.status(400).json({   //400 is the status of bad request which means the request is invalid
            message: "INVALID REFRESH TOKEN"
        })
    }

    session.revoked = true //this is the way to revoke the session by setting the revoked field to true 
    await session.save() //this is the way to save the session after revoking it

    res.clearCookie("refreshToken") //this is the way to clear the refresh token from the cookie
    res.status(200).json({   //200 is the status of ok which means the user is successfully logged out
        message: "FOOD PARTNER logged out successfully"
    })
}

async function verifyEmail_foodPartner(req, res) {

    const { otp, email } = req.body

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    const otpDoc = await otpModel2.findOne({
        email,
        otpHash
    })

    if (!otpDoc) {
        return res.status(400).json({
            message: "INVALID OTP"
        })
    }

    const foodPartner = await foodPartnerModel.findByIdAndUpdate(
        otpDoc.foodPartner,
        {
            verified: true
        },
        {
            new: true
        }
    )

    await otpModel2.deleteMany({
        foodPartner: otpDoc.foodPartner
    })

    const refreshToken = jwt.sign(
        { id: foodPartner._id },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const accessToken = jwt.sign(
        { id: foodPartner._id },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    );

    return res.status(200).json({
        message: "FOOD PARTNER Verified Successfully",
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.username,
            email: foodPartner.email,
            verified: foodPartner.verified,
            address: foodPartner.address,
            contactName: foodPartner.contactName
        },
        accessToken
    })
}

async function resendOtp_user(req, res) {
    const { email } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    if (user.verified) {
        return res.status(400).json({
            message: "User is already verified"
        })
    }

    const otp = generateOtp()
    const html = getOtpHtml(otp)

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    // Delete old OTP records
    await otpModel.deleteMany({ user: user._id })

    // Create new OTP
    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })

    await sendEmail(email, "OTP VERIFICATION", `Your OTP is ${otp}`, html)

    res.status(200).json({
        message: "OTP resent successfully"
    })
}

async function resendOtp_foodPartner(req, res) {
    const { email } = req.body

    const foodPartner = await foodPartnerModel.findOne({ email })

    if (!foodPartner) {
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }

    if (foodPartner.verified) {
        return res.status(400).json({
            message: "Food Partner is already verified"
        })
    }

    const otp = generateOtp()
    const html = getOtpHtml(otp)

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    // Delete old OTP records
    await otpModel2.deleteMany({ foodPartner: foodPartner._id })

    // Create new OTP
    await otpModel2.create({
        email,
        foodPartner: foodPartner._id,
        otpHash
    })

    await sendEmail(email, "OTP VERIFICATION", `Your OTP is ${otp}`, html)

    res.status(200).json({
        message: "OTP resent successfully"
    })
}

async function forgotPassword_user(req, res) {
    const { email } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "Email not found"
        })
    }

    // Generate reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`

    const html = `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
    `

    await sendEmail(email, "Password Reset Request", `Reset your password: ${resetLink}`, html)

    res.status(200).json({
        message: "Password reset link sent to email"
    })
}

async function forgotPassword_foodPartner(req, res) {
    const { email } = req.body

    const foodPartner = await foodPartnerModel.findOne({ email })

    if (!foodPartner) {
        return res.status(404).json({
            message: "Email not found"
        })
    }

    // Generate reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
        { id: foodPartner._id },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`

    const html = `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="background-color: #1a73e8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
    `

    await sendEmail(email, "Password Reset Request", `Reset your password: ${resetLink}`, html)

    res.status(200).json({
        message: "Password reset link sent to email"
    })
}

async function resetPassword(req, res) {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
        return res.status(400).json({
            message: "Token and new password are required"
        })
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET)

        // Hash new password
        const hashedPassword = crypto.createHash("sha256").update(newPassword).digest("hex")

        // Update user password (determine if user or foodPartner from request or stored info)
        // Try to update user first
        let updatedUser = await userModel.findByIdAndUpdate(
            decoded.id,
            { password: hashedPassword },
            { new: true }
        )

        if (!updatedUser) {
            // Try to update foodPartner
            updatedUser = await foodPartnerModel.findByIdAndUpdate(
                decoded.id,
                { password: hashedPassword },
                { new: true }
            )
        }

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "Password reset successfully"
        })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({
                message: "Reset link has expired. Please request a new one."
            })
        }
        return res.status(400).json({
            message: "Invalid reset link"
        })
    }
}

module.exports = {
    register_user,
    logIn_user,
    getMe_user,
    refreshToken_user,
    logout_user,
    verifyEmail_user,
    resendOtp_user,
    forgotPassword_user,
    register_foodPartner,
    logIn_foodPartner,
    getMe_foodPartner,
    refreshToken_foodPartner,
    logout_foodPartner,
    verifyEmail_foodPartner,
    resendOtp_foodPartner,
    forgotPassword_foodPartner,
    resetPassword
};