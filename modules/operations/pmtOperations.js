const Campus = require('../../models/campus');

// retrieves all the opcr assigned to a campus
module.exports.getOpcrList = (res) => {
    const responseFormat = { opcr: [], error: null };
    try {
    } catch(err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};