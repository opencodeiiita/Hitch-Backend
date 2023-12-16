const { signupValidation, loginValidation } = require("../middlewares/auth.middleware");
const { signup, login } = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.post("/register", signup);

router.post("/login", login);

module.exports = router;