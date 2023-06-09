/*
    Since we are out of time and we need to finish the entire system in two weeks
    I will only design this to be overwritable instead of editable.

    sample format:
    {
        opcr: [
            target: "",
            keySuccess: [{
                keyResult: "",
                successIndicator: "",
            }]
        ]
    }

*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const midParam = require('../../middlewares/middleParamChecker');
const routeOp = require('../../modules/operations/headOperation');
const addOpcr = require('express').Router();

// permission checking for head accounts
const perm = cookiePerm.setTokenPerm('head');
const frmt = cookiePerm.setErrorFormat({ added: false, error: null });

// add parameter checking
const parm = midParam.paramCheckMiddle(['opcr'], { added: false, error: null });
const aprm = midParam.arrayParamCheckMiddle(['target', 'keySuccess'], 'opcr');

// encodes a new opcr to the account
addOpcr.post('/', perm, frmt, parm, aprm, (req, res) => {
    // another manual checking for keySuccess formatting
    const missedParams = [];
    req.body.opcr.forEach((opcrdata, index) => {
        const { target, keySuccess } = opcrdata;
        if (!target || !keySuccess)
            return missedParams.push(`opcrData:${index}`);

        keySuccess.forEach((ks, ksi) => {
            const { keyResult, successIndicator } = ks;
            if (!successIndicator)
                missedParams.push(`opcrData:keySuccess:${ksi}`);
        });
    });

    if (missedParams.length > 0)
        return res.json({ added: false, error: `MissedParams:${missedParams}` });

    const { campusAssigned, officeAssigned } = req.allowedData;
    routeOp.createOPCR(campusAssigned, officeAssigned, req.body.opcr, res);
});

module.exports = addOpcr;