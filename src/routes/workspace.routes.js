const { createWorkspace, updateWorkspace, deleteWorkspace } = require("../controllers/workspace.controller");

module.exports = app => {
    app.post('/workspace', createWorkspace);
    app.put("/workspace/:id", updateWorkspace);
    app.delete("/workspace/:id", deleteWorkspace);
};