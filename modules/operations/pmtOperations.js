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
module.exports.declineOPCR = async (accountID, campusID, declineDetails, res) => {
    const responseFormat = { declined: false, error: null };
    const { departmentID, targets } = declineDetails;

    try {
        // retrieves the campus, and update the comments
        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'CampusRegisteredDoesNotExist';

        const departmentIndex = campusData.departments.findIndex(item => item._id == departmentID);
        if (departmentIndex < 0) throw 'DepartmentDoesntExist';

        // set the opcr status to false or not yet calbrated
        const accountIndex = campusData.departments[departmentIndex].calibrate.findIndex(item => item.userid == accountID);
        if (accountIndex < 0) throw 'PMTNotRegistered';
        campusData.departments[departmentIndex].calibrate[accountIndex].status = false;

        // assign the comments by traversing all the targets of department
        for (let i = 0; i < targets.length; i++) {
            const { targetID, successIDs } = targets[i];
            const targetIndex = campusData.departments[departmentIndex].opcr.findIndex(item => item._id == targetID);

            if (targetIndex < 0) throw 'NonexistentTargetID';
            for (let j = 0; j < successIDs.length; j++) {
                const { id, comment } = successIDs[j];
                const successIndex = campusData
                    .departments[departmentIndex]
                    .opcr[targetIndex]
                    .keySuccess.findIndex(item => item._id == id);

                // update the comment to this opcr
                campusData.departments[departmentIndex]
                    .opcr[targetIndex]
                    .keySuccess[successIndex]
                    .comment = comment;
            }
        }

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