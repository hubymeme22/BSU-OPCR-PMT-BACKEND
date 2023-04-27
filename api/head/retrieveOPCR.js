const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/headOperation');
const retrieveOpcr = require('express').Router();

retrieveOpcr.use(cookiePerm.setTokenPerm('head'));
retrieveOpcr.use(cookiePerm.setErrorFormat({ opcr: [], status: [], error: null }));

// retrieves the opcr of the user
retrieveOpcr.get('/', (req, res) => {
    if (req.allowedDataError) return;

    const { campusAssigned, officeAssigned } = req.allowedData;
    routeOp.retrieveOpcr(campusAssigned, officeAssigned, res);
});

module.exports = retrieveOpcr;