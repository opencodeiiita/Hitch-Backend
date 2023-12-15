const User = require('../models/user.models')
const {response_400, response_500} = require('../utils/responseCodes.utils')

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
        else next();
    }
    catch(err)
    {
        return response_500(res, "Error in User Login", err);
    }
}

const validatePassword = async(req,res, next)=>{
    try
    {
        const user = await User.findOne({email: req.body.email}).select('+password').exec();

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