import * as modelService from "./../../services/v1/modelService.js";
import { verifyToken } from "./../../services/v1/authService.js";
import getMessage from './../../helpers/getMessage.js';
import { logMessage } from "./../../helpers/logger.js";
import { UserProfileDTO } from '../../dto/v1/user.js';
import * as redis from './../../helpers/redis.js';

export const authenticationMiddleware = async (req, res, next, model) => {
    try {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(401).send({
                status: false,
                message: await getMessage('auth.no_token_provided'),
            });
        } else {
            if (await redis.get(`blackListed-${token}`)) {
                return res.status(401).send({
                    status: false,
                    message: await getMessage('auth.session_expired'),
                });
            } else {
                const decoded = await verifyToken(token);
                let userDetails = await modelService.findById(model, decoded.id);
                if (userDetails != null) {
                    req.userId = userDetails.id
                    req.userData = new UserProfileDTO(userDetails)
                    next();
                } else {
                    return res.status(404).send({
                        status: false,
                        message: await getMessage('auth.account_not_exist'),
                    });
                }
            }
        }
    } catch (error) {
        logMessage(req, error);
        return res.status(401).send({
            status: false,
            message: await getMessage('auth.session_expired'),
        });
    }
}