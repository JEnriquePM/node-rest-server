const {Router} = require('express');
const { check } = require('express-validator');

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { existsProductById, existsCategoryById } = require('../helpers/db-validators');

const { validateJWT, validateFields, isAdminRole } = require('../MIDDLEWARES');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Get all products - public
router.get('/', getProducts);

// Get Product by id - public
router.get('/:id',[
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(existsProductById),
    validateFields
], getProduct);

// Create new Product - private - any user with valid token
router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'Not a valid Mongo id').isMongoId(),
    check('category').custom(existsCategoryById),
    validateFields
], createProduct);

// Update Product by id - private - any user with valid token
router.put('/:id', [
    validateJWT,
    // check('category', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(existsProductById),
    validateFields
], updateProduct);

// Delete Product by id - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(existsProductById),
    validateFields
], deleteProduct);

module.exports = router;