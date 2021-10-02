const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'Not valid token'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // Read user from uid
        const user = await User.findById(uid);

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                msg: 'Not valid token'
            });
        }

        // Check if uid status is true
        if (!user.status) {
            return res.status(401).json({
                msg: 'Not valid token'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Not valid token'
        });
    }

    console.log(token);
    next();
}

module.exports = {
    validateJWT
}