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

// get the department opcr by id
getOfficeOpcr.get('/:departmentID', permissionCheckers, (req, res) => {
    const accountUsername = req.allowedData.username;
    routeOp.getOpcrListByDeptID(accountUsername, req.params.departmentID, res);
});

// gets all the office's opcr
getOfficeOpcr.get('/', permissionCheckers, (req, res) => {
    const {username, _id} = req.allowedData;
    routeOp.getOpcrList(_id, username, res);
});

module.exports = getOfficeOpcr;