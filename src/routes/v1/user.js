import express from 'express';
import * as userController from "./../../controllers/v1/userController.js";
import { authenticationMiddleware } from "./../../middlewares/v1/authMiddleware.js"
import * as userRequest from "./../../requests/v1/userRequest.js"

const router = express.Router();

router.use((req, res, next) => authenticationMiddleware(req, res, next, 'User'));

router.route('/').get([], userController.getProfile);
router.route('/all').post([userRequest.getUsersRequest], userController.getAllUsers);
router.route('/change-password').post([userRequest.changePasswordRequest], userController.changePassword);

export { router };