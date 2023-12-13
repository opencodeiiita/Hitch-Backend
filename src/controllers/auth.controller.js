const User = require('../models/user.models')
const {response_201, response_400} = require('../utils/responseCodes.utils')

exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
    });

    user.save()
        .then(user => {
            return response_201(res, 'User created successfully', user)
        })
        .catch(err => {
            return response_400(res, "Error creating user", err)
        });
};