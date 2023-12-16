const User = require('../models/user.models')
const {response_201, response_500, response_400, response_200, response_401} = require('../utils/responseCodes.utils')

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

exports.login = async(req, res) =>
{
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return response_400(res, "Invalid Request: Missing required fields")
        }
        const userExists = await User.findOne({email: email}).exec();
        if (!userExists) {
            return response_400(res, "Invalid Request: User not found");
        }
        const passwordMatch = await userExists.comparePassword(password);
        if (!passwordMatch) {
            return response_401(res, "Invalid Request: Invalid Password");
        }

        return response_200(res, "User Logged In Successfully", {
            name: userExists.name,
            username: userExists.username,
            password: userExists.password,
            token: await userExists.generateToken(),
            }
        )
    }
    catch(err) {
        return response_500(res, "Error logging in", err)
    }
}