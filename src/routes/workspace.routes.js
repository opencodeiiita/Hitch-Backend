const express = require("express");
const isAuthorized = require("../middlewares/auth.middleware");
const { createWorkspace, updateWorkspace } = require("../controllers/workspace.controller");
const { isWorkspaceAdmin } = require("../middlewares/isWorkspaceAdmin.middleware");
const router = express.Router();

module.exports = router;

router.post('/create',isAuthorized, createWorkspace)
router.put('/update/:id', isAuthorized,isWorkspaceAdmin, updateWorkspace);