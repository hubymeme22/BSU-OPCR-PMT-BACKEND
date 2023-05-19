const routeOp = require('../../modules/operations/adminOperation');
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const deleteCampusAPI = require('express').Router();

const perm = cookiePerm.setTokenPerm('admin');
const frmt = cookiePerm.setErrorFormat({ deleted: false, error: null });

// deletes the campus id that is provided
deleteCampusAPI.delete('/:campusID', perm, frmt, (req, res) => {
    routeOp.deleteCampus(req.params.campusID, res);
});

module.exports = deleteCampusAPI;