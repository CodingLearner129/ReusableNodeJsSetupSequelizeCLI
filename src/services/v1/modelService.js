import db from './../../models/v1/index.js';
import { logMessage } from "./../../helpers/logger.js";

export const findById = async (model, id, req) => {
    try {
        return await db[model].findOne({
            where: { id },
            // attributes: ["id", "first_name", "last_name", "full_name", "email", "password", "image", "created_at", "updated_at", "deleted_at"]
        });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}

export const findByEmail = async (model, email, req) => {
    try {
        return await db[model].findOne({
            where: { email },
            // attributes: ["id", "first_name", "last_name", "full_name", "email", "password", "image", "created_at", "updated_at", "deleted_at"]
        });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}

export const findWhere = async (model, where, req) => {
    try {
        return await db[model].findOne({
            where,
            // attributes: ["id", "first_name", "last_name", "full_name", "email", "password", "image", "created_at", "updated_at", "deleted_at"]
        });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}

export const findAndCountAll = async (model, object, limit, offset, req) => {
    try {
        return await db[model].findAndCountAll({
            object,
            limit,
            offset
            // attributes: ["id", "first_name", "last_name", "full_name", "email", "password", "image", "created_at", "updated_at", "deleted_at"]
        });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}

export const create = async (model, data, transaction, req) => {
    try {
        return await db[model].create(data, { transaction });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}

export const update = async (model, data, where, transaction, req) => {
    try {
        return await db[model].update(data, { where }, { transaction });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}

export const destroy = async (model, where, transaction, req) => {
    try {
        return await db[model].destroy({ where }, { transaction });
    } catch (error) {
        logMessage(error, req);
        throw new Error(error);
    }
}
