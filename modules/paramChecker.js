// returns the missed parameters
module.exports.paramChecker = (params, obj) => {
    const missedParams = [];
    params.forEach(p => {
        if (obj[p] == undefined)
            missedParams.push(p);
    });

    return missedParams;
};

// checks the parameter of the array values
module.exports.paramArrayChecker = (params, arr) => {
    const missedParams = [];
    arr.forEach(obj => {
        const missed = module.exports.paramChecker(params, obj);
        if (missed.length > 0)
            missedParams.push(missed);
    });
};