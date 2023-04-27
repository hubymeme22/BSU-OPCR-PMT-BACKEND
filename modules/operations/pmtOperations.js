const Campus = require('../../models/campus');
const Account = require('../../models/accounts');

// retrieves all the opcr assigned to a campus
module.exports.getOpcrList = async (username, res) => {
    const responseFormat = { opcr: [], error: null };
    try {
        const accountData = await Account.findOne({ username: username });
        if (accountData == null)
            throw 'ExpiredAccount';

        if (accountData.campusAssigned == null)
            throw 'NoCampusAssigned';

        const campusData = await Campus.findOne({ _id: accountData.campusAssigned });
        const department = campusData.departments;
        const opcrList = [];

        // retrieves all the offices details with opcr
        department.forEach(dept => {
            if (dept.opcr) opcrList.push(dept);
        });

        responseFormat.opcr = opcrList;
        res.json(responseFormat);

    } catch(err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};