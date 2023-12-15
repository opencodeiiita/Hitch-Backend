const { signupValidation, loginValidation } = require("../middlewares/auth.middleware");
const { signup, login } = require("../controllers/auth.controller");
const express = require("express");

const router = express.Router();

router.post("/register",
  [signupValidation.ensureUniqueEmail, signupValidation.ensureUniqueUsername],
  signup
);

router.post("/login", 
[loginValidation.findUser, loginValidation.validatePassword],
login
);

module.exports = router;