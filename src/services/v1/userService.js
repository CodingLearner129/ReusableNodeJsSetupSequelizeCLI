import db from './../../models/v1/index.js';
import { Op } from 'sequelize';
import configJs from './../../config/config.js';
import getMessage from './../../helpers/getMessage.js';
import { logMessage } from "./../../helpers/logger.js";
import { getPagination, getPagingData } from "./../../helpers/pagination.js";
import { UserProfileDTO, UsersListDTO } from '../../dto/v1/user.js';
import * as modelService from "./modelService.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res, model) => {
    try {
        const userDetails = await modelService.findById(model, req.userId, req);
        if (userDetails) {
            return new UserProfileDTO(userDetails);
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async (req, res, model) => {
    try {
        const { page, size } = req.body;
        const { limit, offset } = getPagination(page, size);
        const object = {};
        let userDetails = await modelService.findAndCountAll(model, object, limit, offset, req);
        userDetails.rows = new UsersListDTO(userDetails.rows);
        if (userDetails) {
            return getPagingData(userDetails, page, limit);
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (req, res, model) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { current_password, new_password } = req.body;
        const userDetails = await modelService.findById(model, req.userId, req);
        if (userDetails) {
            if (!(await bcrypt.compare(current_password, userDetails.password))) {
                res.status(400).send({
                    status: false,
                    message: await getMessage('auth.valid_current_password'),
                });
            } else {
                const salt = await bcrypt.genSalt(Number(configJs.CONFIG.bcrypt_salt_round));
                let updatePassword = { password: await bcrypt.hash(new_password, salt) };
                let where = { id: userDetails.id };
                await modelService.update(model, updatePassword, where, transaction, req);
                await transaction.commit();
                res.status(200).send({
                    status: true,
                    message: await getMessage('auth.password_change_success'),
                });
            }
        } else {
            await transaction.rollback();
            res.status(404).send({
                status: false,
                message: await getMessage('common.data_not_found', { data: "user" }),
            });
        }
    } catch (error) {
        logMessage(req, error);
        await transaction.rollback();
        res.status(500).send({
            status: false,
            message: await getMessage('common.something_went_wrong'),
        });
    }
}