const param = require('../modules/paramChecker');

// middleware for checking the required parameters to request body
module.exports.paramCheckMiddle = (requiredParams, responseFormat={}) => {
    const middleware = (req, res, next) => {
        const missedParams = param.paramChecker(requiredParams, req.body);
        if (missedParams.length > 0) {
            responseFormat.error = `MissedParams: ${missedParams}`;
            return res.json(responseFormat);
        }

        next();
    }

    return middleware;
};

// middleware for checking the required parameters to request body array of objects
module.exports.arrayParamCheckMiddle = (requiredParams, reqBodyKey, responseFormat={}) => {
    const middleware = (req, res, next) => {
        const missedParams = param.paramArrayChecker(requiredParams, req.body[reqBodyKey]);
        if (missedParams.length > 0) {
            responseFormat.error = `MissedParams: ${missedParams}`;
            return res.json(responseFormat);
        }

        next();
    }

    return middleware;
};