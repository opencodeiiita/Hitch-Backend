const { signupValidation } = require("../middlewares/auth.middleware");
const { signup } = require("../controllers/auth.controller");

module.exports = app => {
    app.post('/auth/signup', 
        [ signupValidation.ensureUniqueEmail, signupValidation.ensureUniqueUsername ],
        signup
    );
};