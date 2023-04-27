const Account = require('../../models/accounts');

// registers a new head account
module.exports.registerHead = async (username, password, res) => {
    const responseFormat = { registered: false, error: null };
    try {
        // checks if the account already exists
        const account = await Account.findOne({ username: username });
        if (account != null)
            throw 'AccountAlreadyExist';

        // otherwise, just save the new account
        const newAccount = new Account({
            username: username,
            password: password,
            access: 'head',
        });

        await newAccount.save();
        responseFormat.registered = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// registers a new pmt account
module.exports.registerPMT = async (username, password, res) => {
    const responseFormat = { registered: false, error: null };

    try {
        // checks if the account already exists
        const account = await Account.findOne({ username: username });
        if (account != null)
            throw 'AccountAlreadyExist';

        // otherwise, just save the new account
        const newAccount = new Account({
            username: username,
            password: password,
            access: 'pmt',
        });

        await newAccount.save();
        responseFormat.registered = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};