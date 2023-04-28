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
addOpcr.use(cookiePerm.setTokenPerm('head'));
addOpcr.use(cookiePerm.setErrorFormat({ added: false, error: null }));

// add parameter checking
addOpcr.use(midParam.paramCheckMiddle(['opcr'], { added: false, error: null }));
addOpcr.use(midParam.arrayParamCheckMiddle(['target', 'keySuccess'], 'opcr'));

// encodes a new opcr to the account
addOpcr.post('/', (req, res) => {
    if (req.allowedDataError) return;

    // another manual checking for keySuccess formatting
    const missedParams = [];
    req.body.opcr.forEach((opcrdata, index) => {
        const { target, keySuccess } = opcrdata;
        if (!target || !keySuccess)
            return missedParams.push(`opcrData:${index}`);

        keySuccess.forEach(ks => {
            const { keyResult, successIndicator } = ks;
            if (!keyResult || !successIndicator)
                missedParams.push(`opcrData:keySuccess:${index}`);
        });
    });

    if (missedParams.length > 0)
        return res.json({ added: false, error: null });

    const { campusAssigned, officeAssigned } = req.allowedData;
    routeOp.createOPCR(campusAssigned, officeAssigned, req.body.opcr, res);
});

module.exports = addOpcr;