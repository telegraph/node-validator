const _    = require('lodash');

module.exports = (path, value, config) => {
    let configVal    = _.get(config, path);
    let validationRule = value.validation;
    if (!validationRule || typeof validationRule !== 'function') {
        return `Invalid validation function for '${path}'`;
    }
    let error = validationRule(configVal);
    if (error) {
        return `Invalid configuration value - Custom validation failed, Actual: '${path} = ${configVal}', ${error}`;
    }
};