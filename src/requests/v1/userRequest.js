import niv, { Validator } from 'node-input-validator';
import Joi from 'joi';
import db from './../../models/v1/index.js';
import fs from "fs";
import getMessage from '../../helpers/getMessage.js';
import { Op } from 'sequelize';

niv.extend('upperLetterPassword', async function ({ value, args }) {
    return /[A-Z]/.test(value);
});

niv.extend('lowerLetterPassword', async function ({ value, args }) {
    return /[a-z]/.test(value);
});

niv.extend('digitPassword', async function ({ value, args }) {
    return /\d/.test(value);
});

niv.extend('specialLetterPassword', async function ({ value, args }) {
    return /[!@#$%&*]/.test(value);
});

niv.extend('unique', async function ({ value, args }) {
    try {
        const where = args.length > 1 ? { email: value, id: { [Op.ne]: args[1] } } : { email: value };
        let emailExists = await db[args[0]].findOne({ where });
        return !emailExists;
    } catch (error) {
        return false;
    }
});

niv.extend('differentPassword', async function ({ value, args }) {
    return value !== args[0];
});

const uniqueEmailValidator = async (value, args) => {
    try {
        const where = args.length > 1 ? { email: value, id: { [Op.ne]: args[1] } } : { email: value };
        const emailExists = await db[args[0]].findOne({ where });
        // If the email exists, return an error
        if (emailExists) {
            throw new Error(await getMessage('validation.email.unique'));
        }
        return value;
    } catch (error) {
        throw error;
    }
};

export const changePasswordRequest = async (req, res, next) => {
    if (!Number(req.body.joi)) {
        let data = {
            current_password: req.body.current_password,
            new_password: req.body.new_password,
            confirm_password: req.body.confirm_password,
        }
        // Validation with node-input-validator
        const validator = new Validator(data, {
            current_password: "required|minLength:8|maxLength:15|upperLetterPassword|lowerLetterPassword|digitPassword|specialLetterPassword",
            new_password: "required|minLength:8|maxLength:15|upperLetterPassword|lowerLetterPassword|digitPassword|specialLetterPassword|differentPassword:current_password",
            confirm_password: "required|same:new_password",
        }, {
            'current_password.required': await getMessage('validation.current_password.required'),
            'current_password.minLength': await getMessage('validation.current_password.minLength'),
            'current_password.maxLength': await getMessage('validation.current_password.maxLength'),
            'current_password.upperLetterPassword': await getMessage('validation.current_password.upperLetterPassword'),
            'current_password.lowerLetterPassword': await getMessage('validation.current_password.lowerLetterPassword'),
            'current_password.digitPassword': await getMessage('validation.current_password.digitPassword'),
            'current_password.specialLetterPassword': await getMessage('validation.current_password.specialLetterPassword'),
            'new_password.required': await getMessage('validation.new_password.required'),
            'new_password.minLength': await getMessage('validation.new_password.minLength'),
            'new_password.maxLength': await getMessage('validation.new_password.maxLength'),
            'new_password.upperLetterPassword': await getMessage('validation.new_password.upperLetterPassword'),
            'new_password.lowerLetterPassword': await getMessage('validation.new_password.lowerLetterPassword'),
            'new_password.digitPassword': await getMessage('validation.new_password.digitPassword'),
            'new_password.specialLetterPassword': await getMessage('validation.new_password.specialLetterPassword'),
            'new_password.differentPassword': await getMessage('validation.new_password.differentPassword'),
            'confirm_password.required': await getMessage('validation.confirm_password.required'),
            'confirm_password.same': await getMessage('validation.confirm_password.same'),
        });

        const matched = await validator.check();
        if (!matched) {
            res.status(422).send({
                status: false,
                message: await getMessage('validation.validation_error'),
                error: validator.errors
            });
        } else {
            next();
        }
    } else {
        try {
            // Validation with Joi
            const schema = Joi.object({
                current_password: Joi.string().required().min(8).max(15)
                    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,15}$/)
                    .messages({
                        'any.required': await getMessage('validation.current_password.required'),
                        'string.min': await getMessage('validation.current_password.minLength'),
                        'string.max': await getMessage('validation.current_password.maxLength'),
                        'string.pattern.base': await getMessage('validation.current_password.pattern')
                    }),
                new_password: Joi.string().required().min(8).max(15)
                    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,15}$/)
                    .invalid(Joi.ref('current_password'))
                    .messages({
                        'any.required': await getMessage('validation.new_password.required'),
                        'string.min': await getMessage('validation.new_password.minLength'),
                        'string.max': await getMessage('validation.new_password.maxLength'),
                        'string.pattern.base': await getMessage('validation.new_password.pattern'),
                        'any.invalid': await getMessage('validation.new_password.differentPassword')
                    }),
                confirm_password: Joi.string().required().valid(Joi.ref('new_password'))
                    .messages({
                        'any.required': await getMessage('validation.confirm_password.required'),
                        'any.only': await getMessage('validation.confirm_password.same')
                    })
            });

            let data = {
                current_password: req.body.current_password,
                new_password: req.body.new_password,
                confirm_password: req.body.confirm_password,
            }
            const value = await schema.validateAsync(data);
            next();
        } catch (error) {
            let errorMessage = {};
            if (error.details) {
                Object.assign(errorMessage, ...error.details);
            }
            res.status(422).send({
                status: false,
                message: await getMessage('validation.validation_error'),
                error: errorMessage
            });
        }
    }
}

export const getUsersRequest = async (req, res, next) => {
    if (!Number(req.body.joi)) {
        let data = {
            page: req.body.page,
            size: req.body.size,
        }
        // Validation with node-input-validator
        const validator = new Validator(data, {
            page: "required|integer|min:1|max:1000",
            size: "required|integer|min:1|max:1000",
        }, {
            'page.required': await getMessage('validation.page.required'),
            'page.min': await getMessage('validation.page.min', { value: 1 }),
            'page.max': await getMessage('validation.page.max', { value: 1000 }),
            'page.integer': await getMessage('validation.page.integer'),
            'size.required': await getMessage('validation.size.required'),
            'size.min': await getMessage('validation.size.min', { value: 1 }),
            'size.max': await getMessage('validation.size.max', { value: 1000 }),
            'size.integer': await getMessage('validation.size.integer'),
        });

        const matched = await validator.check();
        if (!matched) {
            res.status(422).send({
                status: false,
                message: await getMessage('validation.validation_error'),
                error: validator.errors
            });
        } else {
            next();
        }
    } else {
        try {
            // Validation with Joi
            const schema = Joi.object({
                page: Joi.number().integer().min(1).max(1000).required().messages({
                    'number.base': await getMessage('validation.page.integer'),
                    'number.integer': await getMessage('validation.page.integer'),
                    'number.min': await getMessage('validation.page.min', { value: 1 }),
                    'number.max': await getMessage('validation.page.max', { value: 1000 }),
                    'any.required': await getMessage('validation.page.required'),
                }),
                size: Joi.number().integer().min(1).max(1000).required().messages({
                    'number.base': await getMessage('validation.size.integer'),
                    'number.integer': await getMessage('validation.size.integer'),
                    'number.min': await getMessage('validation.size.min', { value: 1 }),
                    'number.max': await getMessage('validation.size.max', { value: 1000 }),
                    'any.required': await getMessage('validation.size.required'),
                })
            });

            let data = {
                page: req.body.page,
                size: req.body.size,
            }
            const value = await schema.validateAsync(data);
            next();
        } catch (error) {
            let errorMessage = {};
            if (error.details) {
                Object.assign(errorMessage, ...error.details);
            }
            res.status(422).send({
                status: false,
                message: await getMessage('validation.validation_error'),
                error: errorMessage
            });
        }
    }
}