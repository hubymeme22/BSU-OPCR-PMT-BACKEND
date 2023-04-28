const Campus = require('../../models/campus');
const Account = require('../../models/accounts');
const mongoose = require('mongoose');

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
module.exports.declineOPCR = async (accountID, campusID, declineList, res) => {
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

            // set the calibrated to false: indicating that
            // the opcr is not calibrated (in case that the pmt already approved to this)
            const calibrateIdx = campusData.departments[campusDeptIndex].calibrate.findIndex(item => item.userid == accountID);
            campusData.departments[campusDeptIndex].calibrate[calibrateIdx].status = false;

            // retrieve the specific target from the department
            if (campusDeptIndex >= 0) {
                targets.forEach(targetDetails => {
                    // retrieve the success indicators from the target
                    const { targetID, successIDs } = targetDetails;
                    const targetIndex = campusData.departments[campusDeptIndex].opcr.findIndex(item => item._id == targetID);

                    if (targetIndex >= 0) {
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
        });

        // save the changes applied
        await campusData.save();
        responseFormat.declined = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// accepts the opcr of the office
module.exports.acceptOPCR = async (accountID, campusID, departmentID, res) => {
    const responseFormat = { accepted: false, error: null };
    try {
        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'CampusRegisteredDoesNotExist';

        const departmentIndex = campusData.departments.findIndex(item => item._d == departmentID);
        if (departmentIndex < 0) throw 'NoexistentDepartment';

        // mark the calibration status as zero and check if all the
        // other pmt acccounts already set theirs as true (meaning the paper is valdated)
        // so we have to remove the comments
        const calibrationIndex = campusData.departments[departmentIndex].calibrate.findIndex(item => item.userid == accountID);
        campusData.departments[departmentIndex].calibrate[calibrationIndex].status = true;

        let allPmtApproved = true;
        campusData.departments[departmentIndex].calibrate.forEach(calibPair => {
            if (calibPair.status == false)
                allPmtApproved = false;
        });

        // resets all the comments into empty string
        if (allPmtApproved) {
            for (let di = 0; di < campusData.departments.length; di++) {
                for (let oi = 0; oi < campusData.departments[di].opcr.length; oi++) {
                    for (let ki = 0; ki < campusData.departments[di].opcr[oi].keySuccess.length; ki++) {
                        campusData.departments[di]
                            .opcr[oi]
                            .keySuccess[ki]
                            .comment = '';
                    }
                }
            }
        }

        await campusData.save();
        responseFormat.accepted = true;
        res.json(responseFormat);

    } catch (err) {
        console.log(err);
        responseFormat.error = err;
        res.json(responseFormat);
    }
};