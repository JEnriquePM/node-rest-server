const {Router} = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImageCloudinary, getImage } = require('../controllers/uploads');
const { allowedColections } = require('../helpers');

const { validateFields, validateUploadFile } = require('../MIDDLEWARES');

const router = Router();

router.post('/', validateUploadFile, uploadFile);

router.put('/:colection/:id', [
    validateUploadFile,
    check('id', 'Id must be a mongo id').isMongoId(),
    check('colection').custom(c => allowedColections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);
// ], updateUserImage);

router.get('/:colection/:id', [
    check('id', 'Id must be a mongo id').isMongoId(),
    check('colection').custom(c => allowedColections(c, ['users', 'products'])),
    validateFields
], getImage);

module.exports = router;