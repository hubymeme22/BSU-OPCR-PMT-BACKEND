/*
    In this route, the assigning of respective accounts to each office will be done.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/adminOperation');
const deleteAccountAPI = require('express').Router();
const responseFormat = { deleted: false, error: null };

// assign permission to this route
const perm = cookiePerm.setTokenPerm('admin');
const frmt = cookiePerm.setErrorFormat(responseFormat);

// assign the needed parameters for this route
deleteAccountAPI.delete('/head/:accountID', perm, frmt, (req, res) => {
    if (req.allowedDataError) return;
    routeOp.deleteHeadAccount(req.params.accountID, res);
});

// assign the needed parameters for this route
deleteAccountAPI.delete('/pmt/:accountID', perm, frmt, (req, res) => {
    if (req.allowedDataError) return;
    routeOp.deletePmtAccount(req.params.accountID, res);
});

module.exports = deleteAccountAPI;