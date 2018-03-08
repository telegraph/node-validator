
# TMG Node Validator

## Build Status
![build status](https://travis-ci.org/telegraph/node-validator.svg?branch=master "Build Status")
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1f6988a24aee42b78291d243b404f823)](https://www.codacy.com/app/telegraph/node-validator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=telegraph/node-validator&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1f6988a24aee42b78291d243b404f823)](https://www.codacy.com/app/telegraph/node-validator?utm_source=github.com&utm_medium=referral&utm_content=telegraph/node-validator&utm_campaign=Badge_Coverage)

## Install
```
    npm install @telegraph-engineering/node-validator --save
```
## Description
TMG node validator is a library for validating that any passed object conforms to the spec passed to it.

## Getting started

Once you have installed the pacakge, it can be required, which will return a function that accepts two paramters. The first being the object you wish to test, and the second is the config that the object should be validated against.

Example Checking that a parameter is defined and has type string.

    const Validator = require('@telegraph-engineering/node-validator');
    const spec = {
	    name: {
		    required: true,
		    type: 'string'
		}
	};
	const param = {} //your object to test;

	const errors = Validator(param, spec);
	if (errors && errors.length > 0) {
		console.error("Validation failed");
		console.log(errors.join(' & '));
		return;
    }
    
    //else do your other logic



## Spec options

| Name | Type | Default | Description |
|--|--|--|--|
| [children](#children) | {object} | | all specs for children should be passed in the child param |
| [required](#required) | {boolean} | false | wether or not the paramter must be present|
| [type](#type)| {string} | | The data type that the field must be, equivelant of typeof param
| [requiredIf](#requiredIf)| {string} | | This field is used to specify that this field is required if the passed key is undefined|
| [validation](#validation)| {function}| | A custom validator function, which will be called with the value of the parameter under test, if the function returns anything other than undefined it will be treated as a failure|
| [validValues](#validValues)| {array}|| An array of possible values for this parameter|

<a name="children"></a>
### children

If a passed object has children that you wish to validate, you can pass the specs for the children as children parameter

    const spec = {
	    param1: {
		    children: {
			    param2: {
				    required: true
			    }
		    }
	    }
    };
    Validate({param1: {param2: undefined}}) //fail
    Validate({param1: {param2: true}}) //pass
   
<a name="required"></a>
### required

This field defines if a field is required

    const spec = {
	    param1: {
		    required: true
	    }
    };
    Validate({param1: undefined}) //fail
    Validate({param1: true}) //pass

<a name="type"></a>
### type

This field defines what type of fata the field must contain, if it is defined

    const spec = {
	    param1: {
		    type: 'string'
	    }
    };
    Validate({param1: 1234}) //fail
    Validate({param1: 'String'}) //pass

<a name="requiredIf"></a>
### requiredIf

This field allows you to specify that this field is required, if another field is undefined

    const spec = {
	    param1: {
		    requiredIf: 'param2'
	    },
	    param2: {
		    type: 'string'
	    }
    };
    Validate({param1: undefined, param2: undefined}) //fail
    Validate({param1: undefined, param2: 'String 2'}) //pass
    Validate({param1: 1234}) //pass
    Validate({param1: 'String', param2: 'String 2'}) //pass

<a name="validation"></a>
### validation

Allows the passing of a custom function to validate values

    const spec = {
	    param1: {
		    validation: (val) => {
			    if (val.indexOf('invalid') < -1) {
				    return "Should not contain invalid";
			    }
		    }
	    }
    };
    Validate({param1: 'this string is invalid'}) //fail
    Validate({param1: 'this string is valid'}) //pass

<a name="validValues"></a>
### validValues

Allows the passing of a list of values that the paramter must match one of

    const spec = {
	    param1: {
		    validValues: ['valid', 27]
	    }
    };
    Validate({param1: 'this string is invalid'}) //fail
    Validate({param1: 27}) //pass
    Validate({param1: 'valid'}) //pass

## Limitations

 - The tool cannot currently validate the values of arrays

## The future

 - Support for arrays
 - Support for callback/ promise for custom validation
