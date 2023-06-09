const Campus = require('../../models/campus');
const Account = require('../../models/accounts');

// retrieves all the opcr assigned to a campus
module.exports.getOpcrList = async (id, username, res) => {
    const responseFormat = { opcr: [], hasVoted: false, error: null };
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
            dept.hasVoted = dept.calibrate.find(item => item.userid == id).voted;
            if (dept.opcr) opcrList.push(dept);
        });

        responseFormat.opcr = opcrList;
        res.json(responseFormat);

    } catch(err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// retrieves all the opcr assigned to a campus
module.exports.getOpcrListByDeptID = async (username, deptID, res) => {
    const responseFormat = { opcr: [], hasVoted: false, error: null };
    try {
        const accountData = await Account.findOne({ username: username });
        if (accountData == null)
            throw 'ExpiredAccount';

        if (accountData.campusAssigned == null)
            throw 'NoCampusAssigned';

        const campusData = await Campus.findOne({ _id: accountData.campusAssigned });
        if (campusData == null) throw 'PmtNotRegistered';

        const department = campusData.departments.find(item => item._id == deptID);
        if (department == null) throw 'NonexistentDepartment';

        responseFormat.hasVoted = department.calibrate.find(item => item.userid == accountData._id).voted;
        responseFormat.opcr = department.opcr;
        res.json(responseFormat);

    } catch(err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// declines the opcr and sets the comment(s) for success indicators
module.exports.declineOPCR = async (accountID, declineDetails, res) => {
    const responseFormat = { declined: false, error: null };
    const { departmentID, targets } = declineDetails;

    try {
        // retrieves the campus, and update the comments
        const accountData = await Account.findOne({ _id: accountID });
        if (accountData == null) throw 'AccountDoesNotExistAnymore';

        const campusID = accountData.campusAssigned;
        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'CampusRegisteredDoesNotExist';

        const departmentIndex = campusData.departments.findIndex(item => item._id == departmentID);
        if (departmentIndex < 0) throw 'DepartmentDoesntExist';

        // set the status to declined if all of the pmt has voted, and one of them declined
        const targetDept = campusData.departments[departmentIndex];
        let allVoted = true;
        for (let i = 0; i < targetDept.calibrate.length; i++) {
            if (!targetDept.calibrate[i].voted) {
                allVoted = false;
                break;
            }
        }

        if (allVoted) {
            // one of the pmt declined
            for (let i = 0; i < targetDept.calibrate.length; i++) {
                if (targetDept.calibrate[i].status == false) {
                    campusData.departments[departmentIndex].status = 'Not Calibrated (Declined)';
                    break;
                }
            }
        }

        // set the opcr status to false or not yet calbrated
        const accountIndex = campusData.departments[departmentIndex].calibrate.findIndex(item => item.userid == accountID);
        if (accountIndex < 0) throw 'PMTNotRegistered';

        const hasVoted = campusData.departments[departmentIndex].calibrate[accountIndex].voted;
        if (hasVoted) throw 'PmtAlreadyVoted';

        campusData.departments[departmentIndex].calibrate[accountIndex].status = false;
        campusData.departments[departmentIndex].calibrate[accountIndex].voted = true;

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
module.exports.acceptOPCR = async (accountID, departmentID, res) => {
    const responseFormat = { accepted: false, error: null };
    try {
        const campusData = await Campus.findOne({ 'departments._id': departmentID });
        if (campusData == null) throw 'CampusRegisteredDoesNotExist';

        const departmentIndex = campusData.departments.findIndex(item => item._id == departmentID);
        if (departmentIndex < 0) throw 'NoexistentDepartment';

        // mark the calibration status as zero and check if all the
        // other pmt acccounts already set theirs as true (meaning the paper is valdated)
        // so we have to remove the comments
        const calibrationIndex = campusData.departments[departmentIndex].calibrate.findIndex(item => item.userid == accountID);
        const hasVoted = campusData.departments[departmentIndex].calibrate[calibrationIndex].voted;
        if (hasVoted) throw 'PmtAlreadyVoted';

        campusData.departments[departmentIndex].calibrate[calibrationIndex].status = true;
        campusData.departments[departmentIndex].calibrate[calibrationIndex].voted = true;

        let allPmtApproved = true;
        campusData.departments[departmentIndex].calibrate.forEach(calibPair => {
            if (calibPair.status == false)
                allPmtApproved = false;
        });

        // resets all the comments into empty string
        // set the status as calibrated
        if (allPmtApproved) {
            campusData.departments[departmentIndex].status = 'Calibrated';
            const department = campusData.departments[departmentIndex];
            for (let i = 0; i < department.opcr.length; i++) {
                const currentOpcr = department.opcr[i];
                for (let j = 0; j < currentOpcr.keySuccess.length; j++) {
                    campusData.departments[departmentIndex]
                        .opcr[i]
                        .keySuccess[j]
                        .comment = '';
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