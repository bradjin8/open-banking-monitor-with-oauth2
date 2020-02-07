const Logger = require('simple-node-logger'),
    options = {
        logFilePath: "./monitoring.log",
        timestampFormat: "YYYY-MM-DD HH:mm:ss"
    },
    log = Logger.createSimpleLogger(options);

module.exports = log;
