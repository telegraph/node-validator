const _    = require('lodash');

module.exports = (path, value, config) => {
    let configVal    = _.get(config, path);
    let validValues  = value.validValues;
    if (configVal && validValues.indexOf(configVal) === -1) {
        return `Invalid configuration value - Actual: '${path} = ${configVal}' Expected: ${path} to be one of "${validValues.join(', ')}"`;
    }
};