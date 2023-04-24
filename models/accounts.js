/*
    This section contains the model for account collection.
    There are three(3) types of account: admin, head, pmt
    which will vary in functionalities.

    The 'head' account will have 'officeAssigned' field, while
    the 'pmt' account will have 'campusAssigned' field.
*/
const mongoose = require('mongoose');
const Account = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    access: {
        type: String,
        required: true,
        enum: ['admin', 'head', 'pmt']
    },

    // possible values that will vary
    // depending on access-type of account
    campusAssigned: {
        type: mongoose.Types.ObjectId,
        required: false
    },

    // office can be a "department"
    officeAssigned: {
        type: mongoose.Types.ObjectId,
        required: false
    }
});

module.exports = mongoose.model('accounts', Account);