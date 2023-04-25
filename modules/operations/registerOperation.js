const Account = require('../../models/accounts');

// registers a new head account
module.exports.registerHead = async (username, password, res) => {
    const responseFormat = { registered: false, error: null };
    const newAccount = new Account({
        username: username,
        password: password,
        access: 'head',
    });

    try {
        // checks if the account already exists
        const account = await Account.findOne({ username: username });
        if (account != null)
            throw 'AccountAlreadyExist';

        // otherwise, just save the new account
        await newAccount.save();
        responseFormat.registered = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};