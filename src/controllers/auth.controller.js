const User = require('../models/user.models')
const {response_201, response_500} = require('../utils/responseCodes.utils')

exports.signup = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
    });

    try {
        const savedUser = await user.save();
        return response_201(res, 'User created successfully', {
            token: await user.generateToken(),
            name: savedUser.name,
            username: savedUser.username,
            channels: savedUser.channels,
        })
    } catch (err) {
        return response_500(res, "Error creating user", err)
    }
};