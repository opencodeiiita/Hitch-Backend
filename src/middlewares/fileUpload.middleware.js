const jwt = require('jsonwebtoken');

const secretKey = 'yourSecretKey'; 

function generateToken(userId) {
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
}

function authorizationMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return sendErrorResponse(res, 401, 'Unauthorized', 'No token provided');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return sendErrorResponse(res, 401, 'Unauthorized', 'Invalid or expired token');
    }
}

function sendErrorResponse(res, statusCode, error, message) {
    res.status(statusCode).json({
        result: false,
        error: error,
        message: message,
    });
}

module.exports = {
    generateToken,
    authorizationMiddleware,
};
