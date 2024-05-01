import bcrypt from "bcrypt";
import * as authService from "./../../services/v1/authService.js";
import getMessage from './../../helpers/getMessage.js';
import { logMessage } from "./../../helpers/logger.js";

export const signUp = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(Number(configJs.CONFIG.bcrypt_salt_round));
        req.bcryptPassword = await bcrypt.hash(password, salt);
        await authService.signUp(req, 'User');
        res.status(201).send({
            status: true,
            message: await getMessage('auth.signup_success'),
        });
    } catch (error) {
        logMessage(error, req);
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
        });
    }
}

export const logIn = async (req, res) => {
    await authService.logIn(req, res, 'User');
}

export const refreshToken = async (req, res) => {
    await authService.refreshToken(req, res);
}

export const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req, res, 'User');
}

export const resetPassword = async (req, res) => {
    await authService.resetPassword(req, res, 'User');
}

export const logOut = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: await getMessage('auth.no_token_provided'),
            });
        }
        await authService.logOut(token);
        res.status(200).send({
            status: true,
            message: await getMessage('auth.logout_success'),
        });
    } catch (error) {
        logMessage(error, req);
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
        });
    }
}
