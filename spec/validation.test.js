
'use strict';

const Validation = require('../index').validation;

describe('Given a configuration object', () => {
    let configValidation = {
        param1:{
            param11: {
                required: false,
                type    : 'string'
            },
            param12: {
                type    : 'number'
            },
            param13: {
                validValues: [1,2,3]
            }
        },
        param2: {
            required: true,
            type    : 'string'
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
    });

    describe("It should not return errors if ", () => {
        it("required fields are present", () => {
            let result = Validation({param2: "value2"}, configValidation);

            expect(result).toEqual([]);
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
    });
});
