import db from './../../models/v1/index.js';
import { Op } from 'sequelize';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { promisify } from "util";
import configJs from './../../config/config.js';
import getMessage from './../../helpers/getMessage.js';
import { logMessage } from "./../../helpers/logger.js";
import { UserLogInDTO } from '../../dto/v1/user.js';
import * as redis from './../../helpers/redis.js';
import * as modelService from "./modelService.js";
import fs from 'fs';
import crypto from "crypto";
import moment from 'moment';
import Email from '../../helpers/email.js';

const signToken = async (data, expiresIn) => {
    return jwt.sign(data, configJs.CONFIG.jwt_encryption, { expiresIn });
};

export const verifyToken = async (token) => {
    try {
        return await promisify(jwt.verify)(token, configJs.CONFIG.jwt_encryption);
    } catch (error) {
        throw error;        
    }
};

export const signUp = async (req, model) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { first_name, last_name, email, bcryptPassword } = req.body;
        const result = await modelService.create(model, {
            first_name,
            last_name,
            email,
            image: `images/${req.file.filename}`,
            password: bcryptPassword,
            created_at: moment().unix(),
            updated_at: moment().unix()
        }, transaction, req);
        await transaction.commit();
        // created_at: new Date().getTime(),
        // updated_at: new Date().getTime()
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export const logIn = async (req, res, model) => {
    try {
        const { email, password } = req.body;
        const userDetails = await modelService.findByEmail(model, email, req);
        if (userDetails) {
            if (!(await bcrypt.compare(password, userDetails.password))) {
                res.status(401).send({
                    status: false,
                    message: await getMessage('auth.invalid_credentials'),
                });
            } else {
                //Token generation
                userDetails.accessToken = await signToken({ id: userDetails.id, email: userDetails.email }, '1h');
                const refreshToken = await signToken({ id: userDetails.id, email: userDetails.email }, '1d');
                await redis.set(userDetails.accessToken, refreshToken, 60 * 60 * 24);

                res.status(200).send({
                    status: true,
                    message: await getMessage('auth.login_success'),
                    data: new UserLogInDTO(userDetails)
                });
            }
        } else {
            res.status(401).send({
                status: 401,
                message: await getMessage('auth.invalid_credentials'),
                data: {}
            });
        }
    } catch (error) {
        logMessage(error, req);
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
            data: {}
        });
    }
}

export const refreshToken = async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: await getMessage('auth.no_token_provided'),
                data: {}
            });
        }
        if (await redis.get(`blackListed-${token}`)) {
            return res.status(401).send({
                status: false,
                message: await getMessage('auth.session_expired'),
            });
        } else {
            const refreshToken = await redis.get(token);
            if (!refreshToken) {
                return res.status(400).send({
                    success: false,
                    message: await getMessage('auth.no_refresh_token_provided'),
                    data: {}
                });
            }
            const decoded = await verifyToken(refreshToken);
            if (decoded) {
                const accessToken = signToken({ id: decoded.id, email: decoded.email }, '1h');
                await redis.del(token);
                await redis.set(accessToken, refreshToken, 60 * 60 * 24);
                res.status(200).send({
                    status: true,
                    message: await getMessage('auth.token_refreshed'),
                    data: {
                        accessToken
                    }
                });
            } else {
                await redis.del(token);
                return res.status(401).send({
                    status: false,
                    message: await getMessage('auth.no_token_provided'),
                    data: {}
                });
            }
        }
    } catch (error) {
        logMessage(error, req);
        await redis.del(token);
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
            data: {}
        });
    }
}

export const logOut = async (req, res) => {
    try {
        await redis.set(`blackListed-${token}`, token, 60 * 60 * 24 * 7);
        await redis.del(token);
        return true;
    } catch (error) {
        throw error;
    }
}

export const forgotPassword = async (req, res, model) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { email } = req.body;
        let reset_count = 0;
        let setResetPasswordRequest = {};
        let getUser = await modelService.findByEmail(model, email, req);
        if (getUser) {
            const token = crypto.randomBytes(48).toString("base64url");
            const currentTimestamp = moment().unix();
            const getResetPasswordRequest = await modelService.findWhere('PasswordReset', { email, model }, req);
            if (!getResetPasswordRequest) {
                setResetPasswordRequest = {
                    email,
                    token,
                    model,
                    expired_at: moment().add(5, "minutes").unix(),
                    reset_count,
                    reset_requested_at: currentTimestamp,
                    created_at: currentTimestamp,
                };
                await modelService.create('PasswordReset', setResetPasswordRequest, transaction, req);
            } else {
                if (getResetPasswordRequest.expired_at > currentTimestamp) {
                    await transaction.rollback();
                    let token = getResetPasswordRequest.token;
                    return res.status(200).send({
                        status: false,
                        message: await getMessage('auth.forgot_password_success'),
                        data: { token }
                    });
                } else {
                    setResetPasswordRequest = {
                        email,
                        token,
                        model,
                        expired_at: moment().add(5, "minutes").unix(),
                        reset_count: getResetPasswordRequest.reset_count + 1,
                        reset_requested_at: currentTimestamp,
                    };
                    const where = { email, model };
                    await modelService.update('PasswordReset', setResetPasswordRequest, where, transaction, req);
                }
            }
            // const resetUrl = `${req.protocol}://${req.get(
            //     "host"
            // )}/v1/reset-password/${resetToken}`;
            // new Email(getUser, resetUrl).sendPasswordReset();
            await transaction.commit();
            return res.status(200).send({
                status: true,
                message: await getMessage('auth.forgot_password_success'),
                data: { token }
            });
        } else {
            await transaction.rollback();
            return res.status(404).send({
                status: false,
                message: await getMessage('auth.email_not_found'),
                data: {}
            });
        }
    } catch (error) {
        logMessage(error, req);
        await transaction.rollback();
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
            data: {}
        });
    }
}

export const resetPassword = async (req, res, model) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { token, new_password } = req.body;
        const where = { token, model };
        let getResetPasswordRequest = await modelService.findWhere('PasswordReset', where, req);
        if (getResetPasswordRequest) {
            const currentTimestamp = moment().unix();
            if (getResetPasswordRequest.expired_at > currentTimestamp) {
                let getCurrentDetails = await modelService.findWhere(model, { email: getResetPasswordRequest.email }, req);
                if (getCurrentDetails.password == new_password) {
                    await modelService.update(model, { password: new_password, updated_at: currentTimestamp }, where, transaction, req);
                    await modelService.destroy('PasswordReset', where, transaction, req);
                    await transaction.commit();
                    return res.status(202).send({
                        status: true,
                        message: await getMessage('auth.reset_password_success'),
                    });
                } else {
                    await transaction.rollback();
                    return res.status(400).send({
                        status: false,
                        message: await getMessage('auth.must_different_password'),
                    });
                }
            } else {
                await transaction.rollback();
                return res.status(401).send({
                    status: false,
                    message: await getMessage('auth.token_expired'),
                });
            }
        } else {
            await transaction.rollback();
            return res.status(401).send({
                status: false,
                message: await getMessage('auth.token_expired'),
                data: {}
            });
        }
    } catch (error) {
        logMessage(error, req);
        await transaction.rollback();
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
            data: {}
        });
    }
}
