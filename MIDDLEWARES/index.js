const validateFields = require('../middlewares/validate-fileds');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');

module.exports = {
    ...validateFields,
    ...validateRoles,
    ...validateJWT
}