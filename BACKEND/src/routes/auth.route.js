const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

authRouter.post("/user/register", authController.register_user);
authRouter.post("/user/login", authController.logIn_user);
authRouter.get("/user/get_me", authController.getMe_user);
authRouter.get("/user/refreshToken", authController.refreshToken_user);
authRouter.get("/user/logout", authController.logout_user);
// authRouter.get("/logout_all", authController.logoutAll);
authRouter.post("/user/verify_email", authController.verifyEmail_user);
authRouter.post("/user/resend_otp", authController.resendOtp_user);
authRouter.post("/user/forgot-password", authController.forgotPassword_user);


authRouter.post("/foodPartner/register", authController.register_foodPartner);
authRouter.post("/foodPartner/login", authController.logIn_foodPartner);
authRouter.get("/foodPartner/get_me", authController.getMe_foodPartner);
authRouter.get("/foodPartner/refreshToken", authController.refreshToken_foodPartner);
authRouter.get("/foodPartner/logout", authController.logout_foodPartner);
// authRouter.get("/logout_all", authController.logoutAll);
authRouter.post("/foodPartner/verify_email", authController.verifyEmail_foodPartner);
authRouter.post("/foodPartner/resend_otp", authController.resendOtp_foodPartner);
authRouter.post("/foodPartner/forgot-password", authController.forgotPassword_foodPartner);

// Reset password (works for both user and foodPartner)
authRouter.post("/reset-password", authController.resetPassword);

module.exports = authRouter;