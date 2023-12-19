const User = require('../models/user.models.js');
const jwt = require('jsonwebtoken');
const {response_404, response_500} = require('../utils/responseCodes.utils.js');

 async function verifyUser(req, res, next)
{
    const authToken = req.cookies.token || req.token;

    console.log(authToken);
    if (!authToken)
    {
        return response_404(res, "No token provided");
    }

    try
    {
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        req.userId = decoded._id;

        const user = await User.findById(req.userId);

        if (!user)
        {
            return response_404(res, "User not found");
        }

        req.user = user;

        next();
    }
    catch(err)
    {
        return response_500(res, "Failed to authenticate User", err);
    }
}

module.exports = verifyUser;
