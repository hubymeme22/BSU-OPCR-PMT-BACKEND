/*
    In this module, the token parameter on cookies will be checked and validated
    each cookie has their own information that can be derived.
*/
const jwt = require('jsonwebtoken');

// sets a permission that is allowed and check the permission of token
module.exports.setTokenPerm = (permission) => {
    const middleware = (req, res, next) => {
        const { token } = req.cookies;
        try {
            const userdata = jwt.verify(token, process.env.SECRET_KEY).accountData;
            if (userdata.access != permission)
                return req.allowedDataError = true;

            req.allowedData = userdata;
            next();
        } catch(err) {
            req.allowedDataError = true
            next();
        }
    };

    return middleware;
}

// this middleware is for assigning an error format response based on error above
module.exports.setErrorFormat = (responseFormat={}) => {
    const middleware = (req, res, next) => {
        if (req.allowedDataError) {
            responseFormat.error = 'InsufficientPermission';
            return res.json(responseFormat);
        }

        next();
    }

    return middleware;
};