/*
    In this route, the assigning of respective accounts to each office will be done.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/adminOperation');
const deleteAccountAPI = require('express').Router();
const responseFormat = { assigned: false, error: null };

// assign permission to this route
deleteAccountAPI.use(cookiePerm.setTokenPerm('admin'));
deleteAccountAPI.use(cookiePerm.setErrorFormat(responseFormat));

// assign the needed parameters for this route
deleteAccountAPI.delete('/head/:accountID', paramCheckMiddleware, (req, res) => {
    if (req.allowedDataError) return;
    routeOp.deleteHeadAccount(req.params.accountID, res);
});

// assign the needed parameters for this route
deleteAccountAPI.delete('/pmt/:accountID', paramCheckMiddleware, (req, res) => {
    if (req.allowedDataError) return;
    routeOp.deleteHeadAccount(req.params.accountID, res);
});

module.exports = deleteAccountAPI;