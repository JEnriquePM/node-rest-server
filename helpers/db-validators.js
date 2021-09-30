const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = '') => {
    const existsRole = await Role.findOne({role});
    if(!existsRole) {
        throw new Error(`The role especified ( ${role} ) is not valid`);
    }
}

const existsEmail = async (email = '') => {
    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new Error(`Email ( ${email} ) is already in use`);
    }    
}

const existsUserId = async (id) => {
    const idExists = await User.findById(id);
    if (!idExists) {
        throw new Error(`The Id ( ${id} ) does not exist.`);
    }    
}

module.exports = {
    isValidRole,
    existsEmail,
    existsUserId
}