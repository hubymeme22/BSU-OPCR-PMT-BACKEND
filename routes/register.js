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
    // the head must be registered to his/her respective office
    // the office must be an ObjecID string
    const missedParams = param.paramChecker(['campus', 'office'], req.body);
    if (missedParams.length > 0)
        return res.json({ registered: false, error: `MissedParams:${missedParams}` });

    // proceed to registering this account
    const { username, password, campus, office } = req.body;
    routeOp.registerHead(username, password, office, res);
});

// registers a new pmt account
registerRoute.post('/register/pmt', (req, res) => {
    // the pmt must be registered to his/her respective campuses
    // the campus must be an ObjecID string
    const missedParams = param.paramChecker(['campus'], req.body);
    if (missedParams.length > 0)
        return res.json({ registered: false, error: `MissedParams:${missedParams}` });

    // proceed to registering this account
    const { username, password, campus } = req.body;
    routeOp.registerPMT(username, password, campus, res);
});

module.exports = registerRoute;