/*
    This route retrieves all the pmt recorded to their specified campus,
    the campus registered to the pmt's account will depend on the information
    derived from the cookie provided.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/pmtOperations');
const getOfficeOpcr = require('express').Router();

// set permission to pmt accounts
const permissionCheckers = [
    cookiePerm.setTokenPerm('pmt'),
    cookiePerm.setErrorFormat({ opcr: [], error: null })
];

getOfficeOpcr.get('/', permissionCheckers, (req, res) => {
    if (req.allowedDataError) return;

    const accountUsername = req.allowedData.username;
    routeOp.getOpcrList(accountUsername, res);
});

module.exports = getOfficeOpcr;