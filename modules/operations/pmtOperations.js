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

// declines the opcr and sets the comment(s) for success indicators
module.exports.declineOPCR = async (campusID, declineList, res) => {
    const responseFormat = { declined: false, error: null };

    try {
        // retrieves the campus, and update the comments
        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'CampusRegisteredDoesNotExist';

        // manually assign the comments
        declineList.forEach(declineDetails => {
            // retrieve the specific department from the campus
            const { departmentID, targets } = declineDetails;
            const campusDeptIndex = campusData.departments.findIndex(item => item._id == departmentID);

            // retrieve the specific target from the department
            if (campusDeptIndex > 0) {
                targets.forEach(targetDetails => {
                    // retrieve the success indicators from the target
                    const { targetID, successIDs } = targetDetails;
                    const targetIndex = campusData.departments[campusDeptIndex].opcr.findIndex(item => item._id == targetID);

                    if (targetIndex > 0) {
                        successIDs.forEach(successComment => {
                            // retrieve the success indicator index
                            const successIndicatorIndex = campusData.departments[campusDeptIndex].opcr[targetIndex]
                                                            .keySuccess.findIndex(item => item._id == successComment.id);

                            // apply the comment to this success indicator
                            campusData.departments[campusDeptIndex]
                                .opcr[targetIndex]
                                .keySuccess[successIndicatorIndex]
                                .comment = successComment.comment
                        });
                    }
                });
            }
        })
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};