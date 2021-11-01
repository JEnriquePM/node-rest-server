const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');
const Role = require('../models/role');

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const user = await User.findById(term);

        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{status: true}]
    });

    res.json({
        results: users
    });
}

const searchCategories = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const category = await Category.findById(term);

        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const categories = await Category.find({name: regex, status: true});

    res.json({
        results: categories
    });
}

const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const product = await Product.findById(term).populate('category', 'name').populate('user', 'name');

        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const products = await Product.find({name: regex, status: true}).populate('category', 'name').populate('user', 'name');

    res.json({
        results: products
    });
}

const searchRoles = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const role = await Role.findById(term);

        return res.json({
            results: (role) ? [role] : []
        });
    }

    const regex = new RegExp(term, 'i');

    const roles = await Role.find({name: regex});

    res.json({
        results: roles
    });
}

const search = (req, res = response) => {
    const {colection, term} = req.params;

    if (!allowedCollections.includes(colection)) {
        return res.status(400).json({
            msg: `Allowed colections are: ${allowedCollections}`
        });
    }

    switch (colection) {
        case 'users':
            searchUsers(term, res);
            break;

        case 'categories':
            searchCategories(term, res);
            break;

        case 'products':
            searchProducts(term, res);
            break;

        case 'roles':
            searchRoles(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'Search not implemented'
            })
            break;
    }
}

module.exports = {
    search
};