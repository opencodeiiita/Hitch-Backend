const express = require("express");
const isAuthorized = require("../middlewares/auth.middleware");
const { createWorkspace } = require("../controllers/workspace.controller");
const router = express.Router();

module.exports = router;

router.post('/create',isAuthorized, createWorkspace)