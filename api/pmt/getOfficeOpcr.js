/*
    This route retrieves all the pmt recorded to their specified campus,
    the campus registered to the pmt's account will depend on the information
    derived from the cookie provided.
*/
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const getOfficeOpcr = require('express').Router();

// set permission to pmt accounts
getOfficeOpcr.use(cookiePerm.setTokenPerm('pmt'));
getOfficeOpcr.use(cookiePerm.setErrorFormat({ opcr: [], error: null }));

getOfficeOpcr.get('/', (req, res) => {
    const accountData = req.allowedData;
});

module.exports = getOfficeOpcr;