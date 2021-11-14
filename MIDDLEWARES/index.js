const validateFields = require('./validate-fileds');
const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-roles');
const validateUploadFile = require('./validate-file');

module.exports = {
    ...validateFields,
    ...validateRoles,
    ...validateJWT,
    ...validateUploadFile
}