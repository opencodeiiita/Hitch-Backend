const User = require("../models/user.models");
const {
    response_201,
    response_500,
    response_400,
    response_200,
    response_401,
} = require("../utils/responseCodes.utils");

exports.signup = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return response_400(res, "Missing required fields");
        }

        const emailExists = await User.findOne({ email: email }).exec();
        if (emailExists) {
            return response_400(res, "email is already in use");
        }

        const usernameExists = await User.findOne({
            username: username,
        }).exec();
        if (usernameExists) {
            return response_400(res, "username is already in use");
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        });

        const savedUser = await user.save();

        // send token in cookie
        const token = await savedUser.generateToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        return response_201(res, "User Created Successfully", {
            name: savedUser.name,
            username: savedUser.username,
            token: token,
        });
    } catch (err) {
        return response_500(res, "Error creating user", err);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return response_400(res, "Missing required fields");
        }
        const userExists = await User.findOne({ email: email })
            .select("password name username")
            .exec();

        if (!userExists) {
            return response_400(res, "User not found");
        }
        const passwordMatch = await userExists.comparePassword(password);
        if (!passwordMatch) {
            return response_401(res, "Invalid Password");
        }

        // send token in cookie
        const token = await userExists.generateToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        return response_200(res, "User Logged In Successfully", {
            name: userExists.name,
            username: userExists.username,
            token: await userExists.generateToken(),
        });
    } catch (err) {
        return response_500(res, "Error logging in", err);
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return response_200(res, "User Logged Out Successfully");
    } catch (err) {
        return response_500(res, "Error logging out", err);
    }
};
