// simple logger implementation for reading logs
module.exports = () => {
    const loggerType = process.env.LOGGER;
    console.log(`[+] Logger type added: ${loggerType}`);

    if (!loggerType)
        return (req, res, next) => { next(); }

    // logs the request type and request route
    if (loggerType == 'normal')
        return (req, res, next) => {
            console.log(`[request] ${req.method} ${req.path}`);
            next();
        }
};