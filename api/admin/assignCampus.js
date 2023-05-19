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
const perm = cookiePerm.setTokenPerm('admin');
const frmt = cookiePerm.setErrorFormat({ added: false, error: null });

// parameter filter checking
const parm = midParam.paramCheckMiddle(['campusName', 'departmentDetails'], { added: false, error: null });
const aprm = midParam.arrayParamCheckMiddle(['name'], 'departmentDetails', { added: false, error: null });

// sets a campus alongside with the offices that belongs to this campus
assignCampusAPI.post('/', perm, frmt, parm, aprm, (req, res) => {
    const { campusName, departmentDetails } = req.body;
    routeOp.addCampus(campusName, departmentDetails, res);
});

module.exports = assignCampusAPI;