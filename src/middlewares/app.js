const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cookieParser());
const { generateToken, authorizationMiddleware } = require('./authorization.js');

app.post('/login', (req, res) => {
    // Assuming  a user ID from your MongoDB
    const userId = '123'; 

    const token = generateToken(userId);
    res.cookie('token', token, { httpOnly: true });
    res.json({ result: true, message: 'Login successful' });
});
app.get('/protected-resource', authorizationMiddleware, (req, res) => {
    res.json({ result: true, message: 'Access granted', userId: req.userId });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
