const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/headOperation');
const retrieveOpcr = require('express').Router();

const perm = cookiePerm.setTokenPerm('head');
const frmt = cookiePerm.setErrorFormat({ opcr: [], status: [], error: null });

// retrieves the opcr of the user
retrieveOpcr.get('/', perm, frmt, (req, res) => {
    const { campusAssigned, officeAssigned } = req.allowedData;
    routeOp.retrieveOpcr(campusAssigned, officeAssigned, res);
});

module.exports = retrieveOpcr;