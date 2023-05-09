const routeOp = require('../../modules/operations/adminOperation');
const deleteCampusAPI = require('express').Router();

// deletes the campus id that is provided
deleteCampusAPI.delete('/:campusID', (req, res) => {
    routeOp.deleteCampus(req.params.campusID, res);
});

module.exports = deleteCampusAPI;