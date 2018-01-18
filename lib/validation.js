
'use strict';

const _    = require('lodash');

function validate(config, configValidation, prefix){
    function validateValue(path, type, isRequired){
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
    }

    function validateValues(path, validValues) {
        let configVal    = _.get(config, path);
        if (configVal && validValues.indexOf(configVal) === -1) {
            return `Invalid configuration value - Actual: '${path} = ${configVal}' Expected: ${path} to be one of "${validValues.join(', ')}"`
        }
    }

    let errors = [];
    Object.keys( configValidation )
        .map( key => ([key, configValidation[key]]))
        .map( ([key, value]) => {
            let prefixedKey = prefix ? `${prefix}.${key}` : key;
            if( value.type || value.validValues){
                if( value.type ) {
                    let typeError = validateValue(prefixedKey, value.type, value.required || false );
                    if(typeError){
                        errors.push(typeError);
                    }
                }
                if( value.validValues ) {
                    let valueError = validateValues(prefixedKey, value.validValues );
                    if(valueError){
                        errors.push(valueError);
                    }
                }
            }else{
                let innerErrors = validate(config, value, prefixedKey);
                errors = errors.concat(innerErrors);
            }
        });
    return errors;
}

module.exports = function(config, configValidation){
    return validate(config, configValidation);
};
