const {Router} = require('express');
const { check } = require('express-validator');

const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { existsCategoryById } = require('../helpers/db-validators');

const { validateJWT, validateFields, isAdminRole } = require('../MIDDLEWARES');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Get all categories - public
router.get('/', getCategories);

// Get category by id - public
router.get('/:id',[
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields
], getCategory);

// Create new category - private - any user with valid token
router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
], createCategory);

// Update category by id - private - any user with valid token
router.put('/:id', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('id').custom(existsCategoryById),
    validateFields
], updateCategory);

// Delete category by id - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(existsCategoryById),
    validateFields
], deleteCategory);

module.exports = router;