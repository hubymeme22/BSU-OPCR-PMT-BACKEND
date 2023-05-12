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
            ref: 'accounts',
            required: false
        },

        calibrate: [{
            userid: {
                type: String,
                required: true
            },

            status: {
                type: Boolean,
                default: false
            },

            voted: {
                type: Boolean,
                default: false
            }
        }],

        status: {
            type: String,
            required: false
        },

        // this part will be assigned by the head account
        opcr: [{
            target: {
                type: String,
                required: true
            },

            keySuccess: [{
                successIndicator: {
                    type: String,
                    required: true
                },

                // this comments will be added by the pmt accounts
                comment: {
                    type: String,
                    required: false,
                    default: "",
                },
                rating: {
                    Q: { type: Boolean },
                    T: { type: Boolean },
                    E: { type: Boolean },
                    A: { type: Boolean }
                }
            }]
        }]
    }]
});

module.exports = mongoose.model('campus', Campus);