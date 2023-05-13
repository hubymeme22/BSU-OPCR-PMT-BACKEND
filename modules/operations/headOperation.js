const Campus = require('../../models/campus');

// creates a new set of opcr for the campus
module.exports.createOPCR = async (campusID, departmentID, opcrData, res) => {
    const responseFormat = { added: false, error: null };
    try {
        // additional check if opcr submitted is empty
        if (opcrData.length <= 0) throw 'EmptyOPCRList';

        const campusData = await Campus.findOne({ _id: campusID });
        if (campusData == null) throw 'ExpiredCampus';

        const departmentIndex = campusData.departments.findIndex(item => item._id == departmentID);
        if (departmentIndex < 0) throw 'NonexistentDepartment';

        // the head already just passed a new opcr
        if (campusData.departments[departmentIndex].status == 'Calibrating')
            throw 'CalibrationInProgress';

        // assign this opcr to be calibrated
        campusData.departments[departmentIndex].status = 'Calibrating';

        // reset all the pmt's calibration status
        const calibrators = campusData.departments[departmentIndex].calibrate;
        for (let i = 0; i < calibrators.length; i++) {
            calibrators[i].status = false;
            calibrators[i].voted = false;
        }

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
        responseFormat.status = departmentData.status ? departmentData.status : 'Newly Generated Form';
        res.json(responseFormat);
    } catch (err) {
        responseFormat.error = err;
        res.json(responseFormat);
    }
};