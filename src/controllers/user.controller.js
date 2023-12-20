const User = require("../models/user.models");
const {
    response_200,
    response_400,
    response_404,
    response_500,
} = require("../utils/responseCodes.utils");

exports.queryUser = async (req, res) => {
    try {
        const { email, username } = req.query;

        if (!email && !username) {
            return response_400(res, "Missing required fields");
        }

        const user = await User.find({
            $or: [
                { email: { $regex: email, $options: "i" } },
                { username: { $regex: username, $options: "i" } },
            ],
        }).exec();

        if (!user) {
            return response_404(res, "User not found");
        }

        return response_200(res, "User Found", {
            name: user.name,
            username: user.username,
            email: user.email,
            profilePicUrl: user.profilePicUrl,
            id: user._id,
        });

    } catch (error) {
        return response_500(res, "Error querying user", error);
    }
}