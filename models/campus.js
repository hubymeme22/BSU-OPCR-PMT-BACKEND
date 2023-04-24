/*
    In this model, campus is defined, the campus will contain
    one or multiple departments. And each department will contain
    a opcr which will be set by the head account.
*/
const mongoose = require('mongoose');
const Campus = new mongoose.Schema({
    campusName: {
        type: String,
        required: true,
        unique: true
    },

    departments: [{
        name: {
            type: String,
            required: true
        },

        // this part will be assigned by the admin soon
        assignedTo: {
            type: mongoose.Types.ObjectId,
            required: false
        },

        // this part will be assigned by the head account
        opcr: [{
            target: {
                type: String,
                required: true
            },

            keySuccess: [{
                keyResult: {
                    type: String,
                    required: true
                },
                successIndicator: {
                    type: String,
                    required: true
                }
            }]
        }]
    }]
});

module.exports = mongoose.model('campus', Campus);