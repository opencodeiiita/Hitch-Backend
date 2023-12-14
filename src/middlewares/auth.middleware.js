const User = require('../models/user.models')
const {response_400, response_500} = require('../utils/responseCodes.utils')

const ensureUniqueEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.username}).exec();
        if (user) {
            return response_400(res, "Failed! Email is already in use!");
        } else next();
    } catch (err) {
        return response_500(res, "Error creating user", err);
    }

}

const ensureUniqueUsername = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username}).exec();
        if (user) {
            return response_400(res, "Failed! Username is already in use!");
        } else next();
    } catch (err) {
        return response_500(res, "Error creating user", err);
    }
};

exports.signupValidation = {
    ensureUniqueEmail,
    ensureUniqueUsername
};
