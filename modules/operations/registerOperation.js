const Account = require('../../models/accounts');
const mongoose = require('mongoose');

// registers a new head account
module.exports.registerHead = async (username, password, campus, office, res) => {
    const responseFormat = { registered: false, error: null };
    const newAccount = new Account({
        username: username,
        password: password,
        access: 'head',
        campusAssigned: mongoose.mongo.ObjectId(campus),
        officeAssigned: mongoose.mongo.ObjectId(office)
    });

    try {
        // checks if the account already exists
        const account = await Account.findOne({ username: username });
        if (account == null)
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

// registers a new pmt account
module.exports.registerPMT = async (username, password, campus, res) => {
    const responseFormat = { registered: false, error: null };
    const newAccount = new Account({
        username: username,
        password: password,
        access: 'pmt',
        campusAssigned: mongoose.mongo.ObjectId(campus)
    });

    try {
        // checks if the account already exists
        const account = await Account.findOne({ username: username });
        if (account == null)
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