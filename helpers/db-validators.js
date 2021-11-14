const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');

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

const existsCategoryById = async (id) => {
    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new Error(`The Id ( ${id} ) does not exist.`);
    }
}

const existsProductById = async (id) => {
    const productExists = await Product.findById(id);
    if (!productExists) {
        throw new Error(`The Id ( ${id} ) does not exist.`);
    }
}

/**
 * Validate allowed colections
 */
const allowedColections = (colection = '', colections = []) => {
    const included = colections.includes(colection);
    if (!included) {
        throw new Error(`The colection ( ${colection} ) is not allowed. [${colections}]`);
    }
    return true;
}

module.exports = {
    isValidRole,
    existsEmail,
    existsUserId,
    existsCategoryById,
    existsProductById,
    allowedColections
}