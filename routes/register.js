// registers the head and pmt accounts
// permission: admin
const routeOp = require('../modules/operations/registerOperation');
const cookiePerm = require('../middlewares/cookieTokenChecker');
const midParam = require('../middlewares/middleParamChecker');
const param = require('../modules/paramChecker');
const registerRoute = require('express').Router();

registerRoute.use(cookiePerm.setTokenPerm('admin'));
registerRoute.use(cookiePerm.setErrorFormat({ registered: false, error: null }));
registerRoute.use(midParam.paramCheckMiddle(['username', 'password']));

// registers a new office head account
registerRoute.post('/register/head', (req, res) => {
    if (req.allowedDataError) return;

    // proceed to registering this account
    const { username, password } = req.body;
    routeOp.registerHead(username, password, res);
});

// registers a new pmt account
registerRoute.post('/register/pmt', (req, res) => {
    if (req.allowedDataError) return;

    // proceed to registering this account
    const { username, password } = req.body;
    routeOp.registerPMT(username, password, res);
});

module.exports = registerRoute;