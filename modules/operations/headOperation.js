const Campus = require('../../models/campus');

// creates a new set of opcr for the campus
module.exports.createOPCR = async (campusID, departmentID, opcrData, res) => {
    const responseFormat = { added: false, error: null };
    try {
        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'ExpiredCampus';

        const departmentIndex = campusData.departments.findIndex(item => item._id == departmentID);
        if (departmentIndex < 0) throw 'NonexistentDepartment';

        // assign this opcr to be calibrated
        campusData.departments[departmentIndex].status = 'Calibrating';

        // reset the opcr to overwrite
        campusData.departments[departmentIndex].opcr = [];
        for (let i = 0; i < opcrData.length; i++) {
            const currOpcr = opcrData[i];
            const format = {
                target: currOpcr.target,
                keySuccess: [],
            };

            // push the keyresults and targets
            for (let j = 0; j < currOpcr.keySuccess.length; j++) {
                const keysuccess = currOpcr.keySuccess[j];
                format.keySuccess.push({
                    successIndicator: keysuccess.successIndicator
                });
            }

            campusData.departments[departmentIndex].opcr.push(format);
        }

        await campusData.save();
        responseFormat.added = true;
        res.json(responseFormat);

    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};

module.exports.retrieveOpcr = async (campusID, departmentID, res) => {
    const responseFormat = { opcr: [], status: '', error: null };
    try {
        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'ExpiredCampus';

        const departmentData = campusData.departments.find(item => item._id == departmentID);
        if (!departmentData) throw 'NonexistentDepartment';

        responseFormat.opcr = departmentData.opcr;
        responseFormat.status = departmentData.status;
        res.json(responseFormat);
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};