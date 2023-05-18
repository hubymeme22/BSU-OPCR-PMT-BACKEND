const Campus = require('../../models/campus');
const Account = require('../../models/accounts');

/*
    adds a campus with respective department details, the details includes
    department name. The assigning of accounts per department will be done
    after the whole campuses and departments are assigned
*/
module.exports.addCampus = async (campusName, departmentDetails, res) => {
    const responseFormat = { added: false, error: null };
    try {
        const campusData = await Campus.findOne({ campusName: campusName });
        if (campusData != null)
            throw 'CampusAlreadyExists';

        // makes a new campus
        const newCampus = new Campus({
            campusName: campusName,
            status: 'Newly Generated Form',
            departments: departmentDetails
        });

        await newCampus.save();
        responseFormat.added = true;
        res.json(responseFormat);
    } catch(err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// assigns a department for the specific office account
module.exports.setDepartmentAccount = async (campusID, departmentID, accountID, res) => {
    const responseFormat = { assigned: false, error: null };
    try {
        const campusData = await Campus.findOne({ _id: campusID, departments: { $elemMatch: { _id: departmentID } } });
        const accountData = await Account.findOne({ _id: accountID });

        if (accountData == null) throw 'NonexistentAccount';
        if (accountData.access != 'head') throw 'NotHeadAccount';
        if (campusData == null) throw 'DoesNotExist';

        // retrieve the department index from the array
        const departmentIndex = campusData.departments.findIndex(item => {
            return item._id == departmentID;
        });

        // a nonexistent department id
        if (departmentIndex < 0) throw 'NonexistentDepartment';

        campusData.departments[departmentIndex].assignedTo = accountID;
        accountData.campusAssigned = campusData._id;
        accountData.officeAssigned = campusData.departments[departmentIndex]._id;

        await campusData.save();
        await accountData.save();

        responseFormat.assigned = true;
        res.json(responseFormat);
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// sets the pmt account to specified campus
module.exports.setCampusAccount = async (campusID, accountID, res) => {
    const responseFormat = { assigned: false, error: null };

    try {
        // remove to previous campus assigned
        const accountData = await Account.findOne({ _id: accountID });
        if (accountData.campusAssigned) {
            const matchedCampus = await Campus.findOne({ _id: accountData.campusAssigned });
            console.log(`This id has matched campus: ${matchedCampus.campusName}`);

            // an existing campus detected
            if (matchedCampus != null) {
                console.log(accountID);

                // searches for all the departments
                for (let i = 0; i < matchedCampus.departments.length; i++) {
                    // searches for all calibration list
                    const arrCopy = matchedCampus.departments[i].calibrate;
                    const calibrationIndex = arrCopy.findIndex(item => item.userid = accountID);

                    if (calibrationIndex >= 0)
                        matchedCampus.departments[i].calibrate.splice(calibrationIndex, 1);
                }

                await matchedCampus.save();
            }
        }

        const campusData = await Campus.findOne({ _id: campusID });

        if (accountData == null) throw 'ExpiredAccount';
        if (accountData.access != 'pmt') throw 'NotPMTAccount';
        if (campusData == null) throw 'NonexistentCampusID';

        // update the opcr calibrators
        campusData.departments.forEach((dept, index) => {
            const calibIndex = dept.calibrate.findIndex(item => item.userid == accountID);
            if (calibIndex < 0) campusData.departments[index].calibrate.push({ userid: accountID, status: false });
        });

        accountData.campusAssigned = campusID;
        await accountData.save();
        await campusData.save();

        responseFormat.assigned = true;
        res.json(responseFormat);
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// retrieves all the campus and its departments
module.exports.getCampusData = async (res) => {
    const responseFormat = { campus: [], error: null };

    try {
        const campusData = await Campus.find().populate({ path: 'departments', model: 'accounts' });
        responseFormat.campus = campusData;
        res.json(responseFormat);
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// retrieves all the account data
module.exports.getAccounts = async (accountType, res) => {
    const responseFormat = { accounts: [], error: null };

    try {
        // checking of account types
        if (accountType == 'head' || accountType == 'pmt') {
            const accounts = await Account.find({ access: accountType })
            if (accounts != null)
                accounts.forEach(acc => {
                    acc.password = 'xxxxxxxx';
                });

            responseFormat.accounts = accounts;
            return res.json(responseFormat);
        }

        // account type not valid
        throw 'InvalidAccountType';

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// deletes the campus by ID
module.exports.deleteCampus = async (campusID, res) => {
    const responseFormat = { deleted: false, error: null };

    try {
        const campuses = await Campus.findOne({ _id: campusID });
        if (campuses == null) throw 'NonexistentCampus';

        await Campus.findOneAndDelete({ _id: campusID });
        responseFormat.deleted = true;
        res.json(responseFormat);
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// deleetes a head account by id
module.exports.deleteHeadAccount = async (accountID, res) => {
    const responseFormat = { deleted: false, error: null };
    try {
        const accountData = await Account.findOneAndDelete({ _id: accountID });
        if (accountData == null) throw 'NonexistentAccount';

        responseFormat.deleted = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

// deletes a pmt account by id
module.exports.deletePmtAccount = async (accountID, res) => {
    const responseFormat = { deleted: false, error: null };
    try {
        const accountData = await Account.findOneAndDelete({ _id: accountID });
        if (accountData == null) throw 'NonexistentAccount';

        // retrieves the campus assigned for this pmt account
        // and remove as calibrator
        if (accountData.campusAssigned) {
            const campusData = await Campus.findOne({ _id: accountData.campusAssigned });
            campusData.departments.forEach((dept, di) => {
                dept.calibrate.forEach(user => {
                    if (user.userid == accountID)
                        campusData.departments[di].calibrate.pop(user);
                });
            });

            await campusData.save();
        }

        responseFormat.deleted = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};