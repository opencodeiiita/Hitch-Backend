const User = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const {
    response_404,
    response_500,
} = require("../utils/responseCodes.utils.js");

async function isAuthorized(req, res, next) {
    const authToken = req.cookies.token || req.token;

    if (!authToken) {
        return response_404(res, "No token provided");
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        // console.log(decoded._id);
        // return;

        const user = await User.findById(decoded._id);

        if (!user) {
            return response_404(res, "User not found");
        }

        req.body.user = user;
     
        next();
    } catch (err) {
        return response_500(res, "Failed to authenticate User", err);
    }
}

module.exports = isAuthorized;
