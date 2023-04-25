// this route retrieves all the account details (not including the passwords)
const cookiePerm = require('../../middlewares/cookieTokenChecker');
const routeOp = require('../../modules/operations/adminOperation');
const retrieveAccounts = require('express').Router();

// assign permission to admin
retrieveAccounts.use(cookiePerm.setTokenPerm('admin'));
retrieveAccounts.use(cookiePerm.setErrorFormat({ accounts: [], error: null }));

retrieveAccounts.get('/:type', (req, res) => {
    routeOp.getAccounts(req.params.type, res);
});

module.exports = retrieveAccounts;