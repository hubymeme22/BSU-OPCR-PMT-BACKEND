/*
    In this route, the campuses and their respective departments will be retrieved
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/adminOperation');
const retrieveCampuses = require('express').Router();

// assign permission for admin only
retrieveCampuses.use(cookiePerm.setTokenPerm('admin'));
retrieveCampuses.use(cookiePerm.setErrorFormat({ campus: [], error: null }));

// retrieves all the campus data
retrieveCampuses.get('/', (req, res) => {
    routeOp.getCampusData(res);
});

module.exports = retrieveCampuses;