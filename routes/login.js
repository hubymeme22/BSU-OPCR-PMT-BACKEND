const midparamChecker = require('../middlewares/middleParamChecker');
const routeOp = require('../modules/operations/loginOperation');
const loginRoute = require('express').Router();

loginRoute.use(midparamChecker.paramCheckMiddle(['username', 'password']));
loginRoute.post('/login', (req, res) => {
    const { username, password } = req.body;
    routeOp.login(username, password, res);
});

module.exports = loginRoute;