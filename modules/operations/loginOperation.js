const Account = require('../../models/accounts');
const jwt = require('jsonwebtoken');

// logs in the account and check for its appropriate permission
module.exports.login = async (username, password, res) => {
    const responseFormat = { access: '',isLoggedIn: false, token: '', error: null };
    try {
        // look for existence of the account
        const accountData = await Account.findOne({ 'username': username });
        if (accountData == null)
            throw 'NonexistentAccount';

        // check if the password matches
        if (accountData.password != password)
            throw 'InvalidCredentials';

        // remove the actual password
        accountData.password = 'what u looking at?';
        responseFormat.isLoggedIn = true;
        responseFormat.access = accountData.access;
        responseFormat.token = jwt.sign({accountData}, process.env.SECRET_KEY);
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};