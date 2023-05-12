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

    // manual checking for specific department
    const responseFormat = { assigned: false, error: null }
    let missedParams = paramChecker.paramChecker(['departmentID', 'targets'], req.body);
    if (missedParams.length > 0) {
        responseFormat.error = `MissedParams:${missedParams}`;
        return res.json(responseFormat);
    }

    // manual checking on target values
    missedParams = paramChecker.paramArrayChecker(['targetID', 'successIDs'], req.body['targets']);
    if (missedParams.length > 0) {
        responseFormat.error = `MissedParams:targets:${missedParams}`;
        return res.json(responseFormat);
    }

    // manual checking on target's success indicator ids
    for (let i = 0; i < req.body['targets'].length; i++) {
        const successIndicator = req.body['targets'][i]['successIDs'];
        missedParams = paramChecker.paramArrayChecker(['id', 'comment'], successIndicator);

        if (missedParams.length > 0) {
            responseFormat.error = `MissedParams:targets:success[${i}]:${missedParams}`;
            return res.json(responseFormat);
        }
    }

    // proceeds to execute the route task
    const { _id } = req.allowedData;
    routeOP.declineOPCR(_id, req.body, res);
});

// accepts an opcr of department
setOpcrStatus.post('/accept', (req, res) => {
    if (req.allowedDataError) return;

    // manual checking of parameter
    const missedParams = paramChecker.paramChecker(['departmentID'], req.body);
    if (missedParams.length > 0)
        return res.json({ accepted: false, error: `MissedParams:${missedParams}` });


    // proceeds to execute the route task
    const { _id, campusAssigned, officeAssigned } = req.allowedData;
    routeOP.acceptOPCR(_id, campusAssigned, officeAssigned, res);
});

module.exports = setOpcrStatus;