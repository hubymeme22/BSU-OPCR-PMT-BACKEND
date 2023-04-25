/*
    In this route, the assigning of respective accounts to each office will be done.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const midParam = require('../../middlewares/middleParamChecker');
const routeOp = require('../../modules/operations/adminOperation');
const assignAccountAPI = require('express').Router();
const responseFormat = { assigned: true, error: null };

// assign permission to this route
assignAccountAPI.use(cookiePerm.setTokenPerm('admin'));
assignAccountAPI.use(cookiePerm.setErrorFormat(responseFormat));

// assign the needed parameters for this route
assignAccountAPI.use(midParam.paramCheckMiddle(['campusID', 'departmentID', 'accountID'], responseFormat));
assignAccountAPI.post('/assign', (req, res) => {
    const { campusID, departmentID, accountID } = req.body;
    routeOp.setDepartmentAccount(campusID, departmentID, accountID, res);
});