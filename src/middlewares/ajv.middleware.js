import Ajv from 'ajv';
const ajv = new Ajv({ verbose: true  ,allErrors: true});
import ajvErrors from 'ajv-errors';
import {BadRequestException} from '../common/exceptions/index.js';
import {propertiesTypeChange} from "../lib/utils.js";
ajvErrors(ajv /*, {singleError: true} */)

const parseAjvErrors = (errors) => {
    const error_message = errors.split('|')[0].trim();
    const client_message = (errors.split('|')[1] !== undefined) ? errors.split('|')[1].trim() : '';

    throw new BadRequestException(error_message, client_message);
};

export const validateBody = (schema) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        propertiesTypeChange(req.body, validate);
        if (validate(req.body)) {
            return next();
        } else {
          parseAjvErrors(validate.errors[0].message);
        }
    };
};

export const validateQuery = (schema) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        propertiesTypeChange(req.query, validate);
        if (validate(req.query)) {
            return next();
        } else {
            parseAjvErrors(validate.errors[0].message);
        }
    };
};

export const validateFile = (schema) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        if (validate(req.file)) {
            return next();
        } else {
            parseAjvErrors(validate.errors[0].message);
        }
    };
};

export const validateParams = (schema) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        propertiesTypeChange(req.params, validate);
        if (validate(req.params)) {
            return next();
        } else {
            parseAjvErrors(validate.errors[0].message);
        }
    };
};

