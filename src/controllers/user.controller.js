const User = require("../models/user.models");
const {
    response_200,
    response_400,
    response_404,
    response_500,
} = require("../utils/responseCodes.utils");

exports.addImage = async (req,res) => {
    try {
        const user = req.user;
        const profilePic = req.file;
    
        if (!profilePic) {
          return res.status(400).json({ error: "Profile picture is required" });
        }
        console.log(user);
        console.log(profilePic);
    
        user.profilePicUrl = profilePic.filename;
        await user.save();
        response_200(res,"Profile picture Added successfully",{profilePicUrl: user.profilePicUrl})
    } 
    catch (error) {
        console.error(error);
        response_500(res,"Internal Server Error",err)
    }
}

exports.queryUser = async (req, res) => {
    try {
        const { email, username } = req.query;

        if (!email && !username) {
            return response_400(res, "Missing required fields");
        }

        const users = await User.find({
            $or: [
                { email: { $regex: email, $options: "i" } },
                { username: { $regex: username, $options: "i" } },
            ],
        }).exec();

        if (!users) {
            return response_404(res, "No user found");
        }

        const userList = users.map((user) => {
            return {
                username: user.username,
                email: user.email,
                name: user.name,
                profilePicUrl: user.profilePicUrl,
                id: user._id,
            };
        });

        return response_200(res, "User Found", userList);
    } catch (error) {
        return response_500(res, "Error querying user", error);
    }
}