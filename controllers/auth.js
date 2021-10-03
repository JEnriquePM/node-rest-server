const {response, json} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { genJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;

    try {
        const {name, img, email} = await googleVerify(id_token);     
        
        let user = await User.findOne({email});
        if (!user) {
            console.log('create user');
            // Create user
            const data = {
                name,
                email,
                password: '*',
                img,
                role: 'USER_ROLE',
                google: true
            };
            console.log(data);
            user = new User(data);
            await user.save();
            console.log(user);
        }

        // If user in DB
        if (!user.status) {
            return res.status(401).json({
                msg: 'Ask your administrator, user blocked'
            });
        }

        // Generate JWT
        const token = await genJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token could not be verificated.'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}