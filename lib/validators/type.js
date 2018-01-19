const _    = require('lodash');

module.exports = (path, value, config) => {
    let type = value.type;
    let isRequired = value.required || false;
    let configVal    = _.get(config, path);
    let configExists = !!configVal;
    let configType   = typeof configVal;


    // If required and does not exist
    if( isRequired && !configExists ){
        return `Missing configuration - '${path}'`;
    }
    // If exists
    if( configExists ){
        if( type !== configType ){
            return `Invalid configuration type - Actual: '${path}@${configType}' Expected: '${path}@${type}'`
        }
    }
};