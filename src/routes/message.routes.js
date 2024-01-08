const { getAllMessages } = require("../controllers/message.controller");
const isAuthorized  = require("../middlewares/auth.middleware");

const express = require("express");

const router = express.Router();

router.get("/getAll/in/:id", isAuthorized, getAllMessages);

module.exports = router;