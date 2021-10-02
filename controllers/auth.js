const {response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { genJWT } = require('../helpers/generate-jwt');

const login = async (req, res = response) => { 
    const {email, password} = req.body;

    try {
        // Check email exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                msg: 'Incorrect User/Password'
            });
        }

        // Check active user
        if (!user.status) {
            return res.status(400).json({
                msg: 'Incorrect User/Password'
            });
        }

        // Check password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect User/Password'
            });
        }

        // Generate JWT
        const token = await genJWT(user.id); 

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ask your administrator'
        });
    } 
}

module.exports = {
    login
}