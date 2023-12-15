const User = require('../models/user.models')
const {response_400, response_500} = require('../utils/responseCodes.utils')
const sendError=require('../utils/responseCodes.utils.js');
const jwt = require('jsonwebtoken');
const secretKey = "777";
const generateToken=User.methods.generatePasswordReset();
function authorizationMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return sendErrorResponse(res, 400 , 'Forbidden', 'No token provided');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return sendErrorResponse(res, 401, 'Unauthorized', 'Invalid or expired token');
    }
}
function sendErrorResponse(res, statusCode, err, message) {
     if(statusCode=400){
        sendError.response_400(res, message, err)
     }
     else if(statusCode=401){
        sendError.response_401(res, message, err)
     }
}
const ensureUniqueEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.username}).exec();
        if (user) {
            return response_400(res, "Failed! Email is already in use!");
        } else next();
    } catch (err) {
        return response_500(res, "Error creating user", err);
    }
}

const ensureUniqueUsername = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username}).exec();
        if (user) {
            return response_400(res, "Failed! Username is already in use!");
        } else next();
    } catch (err) {
        return response_500(res, "Error creating user", err);
    }
};


const findUser = async(req, res, next) =>{
    try
    {
        const user = await User.findOne({email: req.body.email}).exec();

        if(!user)
        {
            return response_400(res, "No User Found with the corresponding Email");
        }
        else 
        {
            req.user = user;
            next();
        }
    }
    catch(err)
    {
        return response_500(res, "Error in User Login", err);
    }
}

const validatePassword = async(req,res, next)=>{
    try
    {
        const user = req.user;

        if(req.body.password == null)
        {
            return response_400(res, "No Password Found");
        }


        const validPassword = await user.comparePassword(req.body.password);

        if(!validPassword)
        {
            return response_400(res, "Wrong Password");
        }
        else next();
    }
    catch(err)
    {
        return response_500(res, "Error in User Login", err);
    }
}


exports.signupValidation = {
    ensureUniqueEmail,
    ensureUniqueUsername
};

exports.loginValidation = 
{
    findUser,
    validatePassword
}

module.exports = {
    generateToken,
    authorizationMiddleware,
};
