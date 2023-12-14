const { signup } = require("../controllers/auth.controller");

module.exports = app => {
    app.post('/auth/signup', signup);
};