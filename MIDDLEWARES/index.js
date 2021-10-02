const validateFields = require('./validate-fileds');
const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-roles');

module.exports = {
    ...validateFields,
    ...validateRoles,
    ...validateJWT
}