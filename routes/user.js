const {Router} = require('express');
const { check } = require('express-validator');

const {
    validateFields, 
    validateJWT, 
    isAdminRole, 
    hasRole} = require('../MIDDLEWARES');

const { existsEmail, existsUserId, isValidRole } = require('../helpers/db-validators');

const { 
    usersGet, 
    userPut, 
    userPost, 
    userDelete, 
    userPatch } = require('../controllers/user.controller');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsUserId),
    check('rol').custom(isValidRole),
    validateFields
],userPut);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'The password must be at least 6 characters').not().isEmpty().isLength({min: 6}),
    check('email', 'Email not valid').isEmail(),
    check('email').custom(existsEmail),
    // check('role', 'Is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validateFields
],userPost);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'OTHER_ROLE'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(existsUserId),
    validateFields
], userDelete);

router.patch('/', userPatch);


module.exports = router;