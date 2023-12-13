const User = require('../models/user.models')
const {response_400, response_500} = require('../utils/responseCodes.utils')

const ensureUniqueEmail = (req, res, next) => {
    User.findOne({email: req.body.username}).exec()
        .then(user => {
            if (user) {
                return response_400(res, "Failed! Email is already in use!");
            } else next();
        })
        .catch(err => {
            return response_500(res, "Error creating user", err);
        });
}

const ensureUniqueUsername = (req, res, next) => {
    User.findOne({username: req.body.username}).exec()
        .then(user => {
            if (user) {
                return response_400(res, "Failed! Username is already in use!");
            } else next();
        })
        .catch(err => {
            return response_500(res, "Error creating user", err);
        });
};

exports.signupValidation = {
    ensureUniqueEmail,
    ensureUniqueUsername
};
