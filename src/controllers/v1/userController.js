import * as userService from "./../../services/v1/userService.js";
import { logMessage } from "./../../helpers/logger.js";
import getMessage from './../../helpers/getMessage.js';

export const getProfile = async (req, res) => {
    try {
        const userDetails = await userService.getProfile(req, res, 'User');
        if (userDetails) {
            res.status(200).send({
                status: true,
                message: await getMessage('common.data_found', { data: "Profile" }),
                data: userDetails
            });
        } else {
            res.status(404).send({
                status: false,
                message: await getMessage('common.data_not_found', { data: "profile" }),
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

export const changePassword = async (req, res) => {
    await userService.changePassword(req, res, 'User');
}

export const getAllUsers = async (req, res) => {
    try {
        const userDetails = await userService.getAllUsers(req, res, 'User');
        if (userDetails) {
            res.status(200).send({
                status: true,
                message: await getMessage('common.data_found', { data: "Users" }),
                data: userDetails
            });
        } else {
            res.status(404).send({
                status: false,
                message: await getMessage('common.data_not_found', { data: "user" }),
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
