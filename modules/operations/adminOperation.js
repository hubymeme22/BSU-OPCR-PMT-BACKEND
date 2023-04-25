const Campus = require('../../models/campus');
const mongoose = require('mongoose');

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
        const campusData = await Campus.findOne({ _id: mongoose.mongo.ObjectId(campusID), departments: { $elemMatch: { _id: departmentId } } });
        if (campusData == null) throw 'DoesNotExist';

        // retrieve the department index from the array
        const departmentIndex = campusData.departments.findIndex(item => {
            return item._id == mongoose.mongo.ObjectId(departmentID);
        });

        // a nonexistent department id
        if (departmentIndex < 0) throw 'NonexistentDepartment';
        campusData.departments[departmentIndex].assignedTo = mongoose.mongo.ObjectId(accountID);
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
}