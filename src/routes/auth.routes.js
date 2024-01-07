const {
    signupValidation,
    loginValidation,
} = require("../middlewares/auth.middleware");
const { signup, login, logout, verifyEmail } = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.post("/register", signup);

router.get("/verify-email/:verificationId",verifyEmail);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
