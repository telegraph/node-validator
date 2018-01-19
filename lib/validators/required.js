const _    = require('lodash');

module.exports = (path, value, config) => {
    let isRequired = value.required;
    let configVal    = _.get(config, path);
    let configExists = !!configVal;

    // If required and does not exist
    if( isRequired && !configExists ){
        return `Missing configuration - '${path}'`;
    }
};