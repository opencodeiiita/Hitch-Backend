const express = require("express");
const isAuthorized = require("../middlewares/auth.middleware");
const { queryUser, addImage } = require("../controllers/user.controller");
const upload = require("../middlewares/fileUpload.middleware");
const router = express.Router();


router.get("/query", isAuthorized, queryUser);
router.post("/add/pic", isAuthorized, upload.single("profilePic"), addImage);

module.exports = router;