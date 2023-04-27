/*
    In this file you can assign a campus and its respective offices
    the purpose of these routes are to keep track of which group of departments/offices
    belongs to.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const midParam = require('../../middlewares/middleParamChecker');
const routeOp = require('../../modules/operations/adminOperation');
const assignCampusAPI = require('express').Router();

// permission assigned to admin
assignCampusAPI.use(cookiePerm.setTokenPerm('admin'));
assignCampusAPI.use(cookiePerm.setErrorFormat({ added: false, error: null }));

// parameter filter checking
assignCampusAPI.use(midParam.paramCheckMiddle(['campusName', 'departmentDetails'], { added: false, error: null }));
assignCampusAPI.use(midParam.arrayParamCheckMiddle(['name'], 'departmentDetails', { added: false, error: null }));

// sets a campus alongside with the offices that belongs to this campus
assignCampusAPI.post('/', (req, res) => {
    if (req.allowedDAtaError) return;

    const { campusName, departmentDetails } = req.body;
    routeOp.addCampus(campusName, departmentDetails, res);
});

module.exports = assignCampusAPI;