const express = require("express");
const UserController = require("../controllers/users.controller");
const router = express.Router();
const {
  auth,
  authRefreshToken,
  roleBasedAuth,
} = require("../middleware/authentication.middleware");

router.get("/", auth, UserController.getUser);

router.post("/signup", UserController.signupUser);

router.post("/username", UserController.checkUsername);

router.post("/login", UserController.loginUser);

router.post("/token/refresh", authRefreshToken, UserController.refreshToken);

router.post("/change-password", auth, UserController.updatePassword);

router.put("/update-profile", auth, UserController.updateUserDetails);

router.post("/send-reset-token", auth, UserController.sendResetToken);

router.post("/send-verify-token", auth, UserController.sendVerifyToken);

router.post("/forgot-password", UserController.resetForgottenPassword);

router.post('/verify-email', auth, UserController.verifyEmail);

module.exports = router;
