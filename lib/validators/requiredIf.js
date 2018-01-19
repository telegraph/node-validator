const _    = require('lodash');

module.exports = (path, value, config) => {
    let paramDepPath = value.requiredIf;
    let configVal    = _.get(config, paramDepPath);

    if (!configVal) {
        return `Invalid configuration value - ${path} is required if ${paramDepPath} is not defined`;
    }
};