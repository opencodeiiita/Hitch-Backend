const express = require("express");
const isAuthorized = require("../middlewares/auth.middleware");
const { queryUser } = require("../controllers/user.controller");
const router = express.Router();

router.get("/query", isAuthorized, queryUser);

module.exports = router;