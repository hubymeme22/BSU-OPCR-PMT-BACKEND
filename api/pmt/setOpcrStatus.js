/*
    These routes will set the status of the opcr (accepted/calibrated)
    whenever an opcr is declined, atleast one of the success indicators
    must have a 'comment'.

    for /decline route, the body must recieve the following format:
    [
        {
            departmentID,
            targets: [
                { targetID, successIDs: [{id, comment}] },
                { targetID, successIDs: [{id, comment}] },
                ...
            ]
        },
        ...
    ]    
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const paramChecker = require('../../modules/paramChecker');
const routeOP = require('../../modules/operations/pmtOperations');

const setOpcrStatus = require('express').Router();
const responseFormat = { assigned: false, error: null };

setOpcrStatus.use(cookiePerm.setTokenPerm('pmt'));
setOpcrStatus.use(cookiePerm.setErrorFormat(responseFormat));


// declines an opcr and adds a comment on targeted success indicator
setOpcrStatus.post('/decline', (req, res) => {
    if (req.allowedDataError) return;

    // manual checking, since the route will recieve an array (departmentID and target assigning)
    const responseFormat = { assigned: false, error: null };
    let missedParams = paramChecker.paramArrayChecker(['departmentID', 'targets'], req.body);
    if (missedParams.length > 0) {
        responseFormat.error = `MissedParams:${missedParams}`;
        res.json(responseFormat);
    }

    // manually checks the targets and its contents
    missedParams = [];
    req.body.forEach(element => {
        element.targets.forEach((opcrDetails, index) => {
            const { targetID, successIDs } = opcrDetails;

            // if one of these are not assigned
            if (!targetID || !successIDs) missedParams.push(`target-success(${index})`);
        });
    });

    if (missedParams.length > 0) {
        responseFormat.error = `MissedParams:${missedParams}`;
        res.json(responseFormat);
    }

    // proceeds to execute the route task
    const { campusAssigned, _id } = req.allowedData;
    routeOP.declineOPCR(_id, campusAssigned, req.body, res);
});

module.exports = setOpcrStatus;