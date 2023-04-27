/*
    In this route, the assigning of respective accounts to each office will be done.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const midParam = require('../../middlewares/middleParamChecker');
const routeOp = require('../../modules/operations/adminOperation');
const assignAccountAPI = require('express').Router();
const responseFormat = { assigned: false, error: null };

// assign permission to this route
assignAccountAPI.use(cookiePerm.setTokenPerm('admin'));
assignAccountAPI.use(cookiePerm.setErrorFormat(responseFormat));

// assign the needed parameters for this route
let paramCheckMiddleware = midParam.paramCheckMiddle(['campusID', 'departmentID', 'accountID'], responseFormat);
assignAccountAPI.post('/head', paramCheckMiddleware, (req, res) => {
    if (req.allowedDataError) return;

    const { campusID, departmentID, accountID } = req.body;
    routeOp.setDepartmentAccount(campusID, departmentID, accountID, res);
});

paramCheckMiddleware = midParam.paramCheckMiddle(['campusID', 'accountID'], responseFormat);
assignAccountAPI.post('/pmt', paramCheckMiddleware, (req, res) => {
    if (req.allowedDataError) return;

    const { campusID, accountID } = req.body;
    routeOp.setCampusAccount(campusID, accountID, res);
});

module.exports = assignAccountAPI;