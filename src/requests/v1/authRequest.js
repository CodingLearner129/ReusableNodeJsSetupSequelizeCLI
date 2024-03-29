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

export const signUpRequest = async (req, res, next) => {
    if (!Number(req.body.joi)) {
        let data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
        }
        // Validation with node-input-validator
        const validator = new Validator(data, {
            first_name: "required|string|minLength:2|maxLength:50",
            last_name: "required|string|minLength:2|maxLength:50",
            email: "required|string|email|minLength:5|maxLength:320|unique:User",
            // email: `required|string|email|minLength:5|maxLength:320|unique:User,${id}`,
            password: "required|minLength:8|maxLength:15|upperLetterPassword|lowerLetterPassword|digitPassword|specialLetterPassword",
        }, {
            'first_name.required': await getMessage('validation.first_name.required'),
            'first_name.string': await getMessage('validation.first_name.string'),
            'first_name.minLength': await getMessage('validation.first_name.minLength'),
            'first_name.maxLength': await getMessage('validation.first_name.maxLength'),
            'last_name.required': await getMessage('validation.last_name.required'),
            'last_name.string': await getMessage('validation.last_name.string'),
            'last_name.minLength': await getMessage('validation.last_name.minLength'),
            'last_name.maxLength': await getMessage('validation.last_name.maxLength'),
            'email.required': await getMessage('validation.email.required'),
            'email.string': await getMessage('validation.email.string'),
            'email.email': await getMessage('validation.email.email'),
            'email.minLength': await getMessage('validation.email.minLength'),
            'email.maxLength': await getMessage('validation.email.maxLength'),
            'email.unique': await getMessage('validation.email.unique'),
            'password.required': await getMessage('validation.password.required'),
            'password.minLength': await getMessage('validation.password.minLength'),
            'password.maxLength': await getMessage('validation.password.maxLength'),
            'password.upperLetterPassword': await getMessage('validation.password.upperLetterPassword'),
            'password.lowerLetterPassword': await getMessage('validation.password.lowerLetterPassword'),
            'password.digitPassword': await getMessage('validation.password.digitPassword'),
            'password.specialLetterPassword': await getMessage('validation.password.specialLetterPassword')
        });

        const matched = await validator.check();
        if (!matched || !req.file) {
            if (!req.file) {
                validator.errors.image = {
                    message: await getMessage('validation.image.required'),
                }
            } else {
                fs.unlinkSync(`${req.file.destination}/${req.file.filename}`);
            }
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
                first_name: Joi.string().min(2).max(50).required().messages({
                    'string.base': await getMessage('validation.first_name.string'),
                    'string.min': await getMessage('validation.first_name.minLength'),
                    'string.max': await getMessage('validation.first_name.maxLength'),
                    'any.required': await getMessage('validation.first_name.required')
                }),
                last_name: Joi.string().min(2).max(50).required().messages({
                    'string.base': await getMessage('validation.last_name.string'),
                    'string.min': await getMessage('validation.last_name.minLength'),
                    'string.max': await getMessage('validation.last_name.maxLength'),
                    'any.required': await getMessage('validation.last_name.required')
                }),
                email: Joi.string().email().min(5).max(320).required().messages({
                    'string.base': await getMessage('validation.email.string'),
                    'string.email': await getMessage('validation.email.email'),
                    'string.min': await getMessage('validation.email.minLength'),
                    'string.max': await getMessage('validation.email.maxLength'),
                    'any.required': await getMessage('validation.email.required')
                }),
                password: Joi.string().min(8).max(15).required()
                    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,15}$/)
                    .messages({
                        'string.pattern.base': await getMessage('validation.password.pattern'),
                        'string.min': await getMessage('validation.password.minLength'),
                        'string.max': await getMessage('validation.password.maxLength'),
                        'any.required': await getMessage('validation.password.required')
                    })
            });

            let data = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
            }
            const value = await schema.validateAsync(data);
            if (!req.file) {
                throw new Error(await getMessage('validation.image.required'));
            }
            await uniqueEmailValidator(data.email, ['User']);
            next();
        } catch (error) {
            let errorMessage = {};
            if (error.details) {
                Object.assign(errorMessage, ...error.details);
            } else if (error.message) {
                Object.assign(errorMessage, { message: error.message });
            }
            fs.unlinkSync(`${req.file.destination}/${req.file.filename}`);
            res.status(422).send({
                status: false,
                message: await getMessage('validation.validation_error'),
                error: errorMessage
            });
        }
    }
}

export const logInRequest = async (req, res, next) => {
    if (!Number(req.body.joi)) {
        let data = {
            email: req.body.email,
            password: req.body.password,
        }
        // Validation with node-input-validator
        const validator = new Validator(data, {
            email: "required|string|email|minLength:5|maxLength:320",
            password: "required|minLength:8|maxLength:15|upperLetterPassword|lowerLetterPassword|digitPassword|specialLetterPassword",
        }, {
            'email.required': await getMessage('validation.email.required'),
            'email.string': await getMessage('validation.email.string'),
            'email.email': await getMessage('validation.email.email'),
            'email.minLength': await getMessage('validation.email.minLength'),
            'email.maxLength': await getMessage('validation.email.maxLength'),
            'password.required': await getMessage('validation.password.required'),
            'password.minLength': await getMessage('validation.password.minLength'),
            'password.maxLength': await getMessage('validation.password.maxLength'),
            'password.upperLetterPassword': await getMessage('validation.password.upperLetterPassword'),
            'password.lowerLetterPassword': await getMessage('validation.password.lowerLetterPassword'),
            'password.digitPassword': await getMessage('validation.password.digitPassword'),
            'password.specialLetterPassword': await getMessage('validation.password.specialLetterPassword')
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
                email: Joi.string().email().min(5).max(320).required().messages({
                    'string.base': await getMessage('validation.email.string'),
                    'string.email': await getMessage('validation.email.email'),
                    'string.min': await getMessage('validation.email.minLength'),
                    'string.max': await getMessage('validation.email.maxLength'),
                    'any.required': await getMessage('validation.email.required')
                }),
                password: Joi.string().min(8).max(15).required()
                    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,15}$/)
                    .messages({
                        'string.pattern.base': await getMessage('validation.password.pattern'),
                        'string.min': await getMessage('validation.password.minLength'),
                        'string.max': await getMessage('validation.password.maxLength'),
                        'any.required': await getMessage('validation.password.required')
                    })
            });

            let data = {
                email: req.body.email,
                password: req.body.password,
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

export const forgotPasswordRequest = async (req, res, next) => {
    if (!Number(req.body.joi)) {
        let data = {
            email: req.body.email,
        }
        // Validation with node-input-validator
        const validator = new Validator(data, {
            email: "required|string|email|minLength:5|maxLength:320",
        }, {
            'email.required': await getMessage('validation.email.required'),
            'email.string': await getMessage('validation.email.string'),
            'email.email': await getMessage('validation.email.email'),
            'email.minLength': await getMessage('validation.email.minLength'),
            'email.maxLength': await getMessage('validation.email.maxLength'),
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
                email: Joi.string().email().min(5).max(320).required().messages({
                    'string.base': await getMessage('validation.email.string'),
                    'string.email': await getMessage('validation.email.email'),
                    'string.min': await getMessage('validation.email.minLength'),
                    'string.max': await getMessage('validation.email.maxLength'),
                    'any.required': await getMessage('validation.email.required')
                })
            });

            let data = {
                email: req.body.email,
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

export const resetPasswordRequest = async (req, res, next) => {
    if (!Number(req.body.joi)) {
        let data = {
            token: req.body.token,
            new_password: req.body.new_password,
            confirm_password: req.body.confirm_password,
        }
        // Validation with node-input-validator
        const validator = new Validator(data, {
            token: "required|string",
            new_password: "required|minLength:8|maxLength:15|upperLetterPassword|lowerLetterPassword|digitPassword|specialLetterPassword",
            confirm_password: "required|same:new_password",
        }, {
            'token.required': await getMessage('validation.email.required'),
            'token.string': await getMessage('validation.email.string'),
            'new_password.required': await getMessage('validation.new_password.required'),
            'new_password.minLength': await getMessage('validation.new_password.minLength'),
            'new_password.maxLength': await getMessage('validation.new_password.maxLength'),
            'new_password.upperLetterPassword': await getMessage('validation.new_password.upperLetterPassword'),
            'new_password.lowerLetterPassword': await getMessage('validation.new_password.lowerLetterPassword'),
            'new_password.digitPassword': await getMessage('validation.new_password.digitPassword'),
            'new_password.specialLetterPassword': await getMessage('validation.new_password.specialLetterPassword'),
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
                token: Joi.string().required().messages({
                    'any.required': await getMessage('validation.token.required'),
                    'string.base': await getMessage('validation.token.string')
                }),
                new_password: Joi.string().required().min(8).max(15)
                    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%&*])[A-Za-z\d!@#$%&*]{8,15}$/)
                    .messages({
                        'any.required': await getMessage('validation.new_password.required'),
                        'string.min': await getMessage('validation.new_password.minLength'),
                        'string.max': await getMessage('validation.new_password.maxLength'),
                        'string.pattern.base': await getMessage('validation.new_password.pattern'),
                    }),
                confirm_password: Joi.string().required().valid(Joi.ref('new_password'))
                    .messages({
                        'any.required': await getMessage('validation.confirm_password.required'),
                        'any.only': await getMessage('validation.confirm_password.same')
                    })
            });

            let data = {
                token: req.body.token,
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