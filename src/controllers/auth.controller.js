const User = require('../models/user.models')
const {response_201, response_500} = require('../utils/responseCodes.utils')

exports.signup = async (req, res) => {
    try {
        const {name, email, password, username} = req.body;

        if (!name || !email || !password || !username) {
            return response_400(res, "Invalid Request: Missing required fields")
        }

        const emailExists = await User.findOne({email: email}).exec();
        if (emailExists) {
            return response_400(res, "Invalid Request: email is already in use");
        }

        const usernameExists = await User.findOne({username: username}).exec();
        if (usernameExists) {
            return response_400(res, "Invalid Request: username is already in use");
        }

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
        return response_500(res, "Error creating user", err)
    }
};