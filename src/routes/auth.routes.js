const {
    signupValidation,
    loginValidation,
} = require("../middlewares/auth.middleware");
const { signup, login, logout } = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.post("/register", signup);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
