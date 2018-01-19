
'use strict';

const Validation = require('../index');

describe('Given a configuration object', () => {
    let configValidation = {
        param1:{
            children: {
                param11: {
                    required: false,
                    type: 'string'
                },
                param12: {
                    type: 'number'
                },
                param13: {
                    validValues: [1, 2, 3]
                }
            }
        },
        param2: {
            required: true,
            type    : 'string'
        },
        param3: {
            required: false,
            type: 'number',
            validation: function (num) {
                const remainder = num % 2;
                if (remainder) {
                    return 'Expected number to be even';
                }
                return undefined;
            }
        }
    };
    let configValidation2 = {
        param1:{
           requiredIf: 'param2'
        },
        param2: {
            required: false
        }
    };
    let configValidation3 = {
        param1: {
            required: false
        }
    };
    describe("It should return errors if ", () => {
        it("fields required are not present", () => {
            let result = Validation({}, configValidation);
            expect(result).toEqual(["Missing configuration - 'param2'"]);
        });

        it("fields types' mismatch", () => {
            let result = Validation({param2: 1}, configValidation);

            expect(result).toEqual(["Invalid configuration type - Actual: 'param2@number' Expected: 'param2@string'"]);
        });

        it("fields values' mismatch", () => {
            let result = Validation({param1: {param13: 4}, param2: 'valid string'}, configValidation);
            expect(result).toEqual(["Invalid configuration value - Actual: 'param1.param13 = 4' Expected: param1.param13 to be one of \"1, 2, 3\""]);
        });
        it("fields custom validation fails", () => {
            let result = Validation({param1: {param13: 3}, param2: 'valid string', param3: 3}, configValidation);
            expect(result).toEqual(["Invalid configuration value - Custom validation failed, Actual: 'param3 = 3', Expected number to be even"]);
        });
        it("fields custom validation has an invalid function defined", () => {
            let configValidationCustom = {
                param1: {
                    validation: "not a function"
                }
            };
            let result = Validation({param1: 27}, configValidationCustom);
            expect(result).toEqual(["Invalid validation function for 'param1'"]);
        });
        it("it is not defined, and a has a required if value that is not defined", () => {
            let result = Validation({}, configValidation2);
            expect(result).toEqual(["Invalid configuration value - param1 is required if param2 is not defined"]);
        });

        it("required field is not defined and does not have a type", () => {
            let result = Validation({}, {param1: {required: true}});
            expect(result).toEqual(["Missing configuration - 'param1'"]);
        });
    });

    describe("It should not return errors if ", () => {
        it("required fields are present", () => {
            let result = Validation({param2: "value2"}, configValidation);

            expect(result).toEqual([]);
        });

        it("Empty object is passed for validation", () => {
            let result = Validation({}, configValidation3);
        });
        it("no object is passed for validation", () => {
            let result = Validation(undefined, configValidation3);
        });

        it("optional fields are not present", () => {
            let result = Validation({
                param1:{
                    param11: "value11"
                },
                param2: "value2"
            }, configValidation);

            expect(result).toEqual([]);
        });
        it("validation passes", () => {
            let result = Validation({
                param1:{
                    param11: "value11"
                },
                param2: "value2",
                param3: 2
            }, configValidation);

            expect(result).toEqual([]);
        });

        it("optional fields are present", () => {
            let result = Validation({
                param1:{
                    param11: "value11",
                    param12: 12
                },
                param2: "value2"
            }, configValidation);

            expect(result).toEqual([]);
        });

        it("feild is undefined but requiredIf feild is defined", () => {
            let result = Validation({
                param2: "value2"
            }, configValidation2);

            expect(result).toEqual([]);
        });

    });
});
