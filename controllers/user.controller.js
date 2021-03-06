const {response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
    const {limit = 5, from = 0} = req.query;
    const query = {status: true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(from))        
        .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const userPut = async (req, res) => {
    const {id} = req.params;
    const {_id, password, google, email, ...rest} = req.body;

    //TODO valdiar contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json(user);
}

const userPost = async (req, res) => {
    const {name, email, password, role} = req.body;
    const user = new User({name, email, password, role});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        msg: 'post API - controller user POST',
        user
    });
}

const userDelete = async (req, res = response) => {
    const {id} = req.params;

    // Deactivate
    const user = await User.findByIdAndUpdate(id, {status: false});
    
    res.json(user);
}

const userPatch = (req, res) => {
    res.json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    usersGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}