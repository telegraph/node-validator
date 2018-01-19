
'use strict';

const _    = require('lodash');

function validate(config, configValidation, prefix){
    const validators = {
        type: require('./validators/type'),
        required: require('./validators/required'),
        validValues: require('./validators/validValues'),
        validation: require('./validators/validation'),
        requiredIf: require('./validators/requiredIf')
    };
    let errors = [];
    Object.keys( configValidation )
        .map( key => ([key, configValidation[key]]))
        .map( ([key, value]) => {
            let prefixedKey = prefix ? `${prefix}.${key}` : key;
            if(!value.children){
                Object.keys( validators )
                    .map( validatorKey => ([validatorKey, validators[validatorKey]]) )
                    .map( ([validatorKey, validator]) => {
                        if (value[validatorKey]) {
                            let error = validator(prefixedKey, value, config);
                            if(error){
                                errors.push(error);
                            }
                        }
                    });
            }else{
                let innerErrors = validate(config, value.children, prefixedKey);
                errors = errors.concat(innerErrors);
            }
        });
    return errors;
}

module.exports = function(config, configValidation){
    return validate(config, configValidation);
};
