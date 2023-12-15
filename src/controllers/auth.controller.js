const User = require('../models/user.models')
const {response_201, response_500, response_400, response_200} = require('../utils/responseCodes.utils')

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

exports.login = async(req, res) =>
{
    const user = await User.findOne({email: req.body.email}).exec();

    try
    {
        return response_200(
            res,
            "User Logged In Successfully",
            {
                username: user.username,
                email: user.email,
                name: user.name,
                id: user._id,
                token: await user.generateToken()
            }
        )
    }
    catch(err)
    {
        return response_500(res, "Couldn't Generate a session. Please try again later", err)
    }
}