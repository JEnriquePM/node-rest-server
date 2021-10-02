const { response } = require("express")

const isAdminRole = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Trying to verify role before token'
        });
    }

    const {role, name} = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not admin user`
        });
    }

    next();
}

const hasRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Trying to verify role before token'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `This service require one of the following roles: ${roles}`
            });
        }
        
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}