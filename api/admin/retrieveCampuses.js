/*
    In this route, the campuses and their respective departments will be retrieved
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/adminOperation');
const retrieveCampuses = require('express').Router();

// assign permission for admin only
const perm = cookiePerm.setTokenPerm('admin');
const frmt = cookiePerm.setErrorFormat({ campus: [], error: null });

// retrieves all the campus data
retrieveCampuses.get('/', perm, frmt, (req, res) => {
    routeOp.getCampusData(res);
});

module.exports = retrieveCampuses;