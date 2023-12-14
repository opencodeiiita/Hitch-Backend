const User = require('../models/user.models')
const { response_201, response_500, response_400, response_409 } = require('../utils/responseCodes.utils')

exports.signup = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        });

        const savedUser = await user.save();
        return response_201(res, 'User created successfully', {
            token: await user.generateToken(),
            name: savedUser.name,
            username: savedUser.username,
            channels: savedUser.channels,
        })
    } catch (err) {
        if (err.name === "ValidationError") {
            let messages = [];

            Object.keys(err.errors).forEach((key) => {
                messages.push(err.errors[key].message);
            });

            return response_400(res, `Invalid Request: ${messages.join(', ')}`);
        } else if (err.code == 11000) {
            return response_409(res, "Invalid Request: username or email already in use")
        }
        return response_500(res, "Error creating user", err)
    }
};