import express from 'express';
import * as authRequest from "./../../requests/v1/authRequest.js";
import { uploadImage } from "./../../requests/v1/uploadFileRequest.js";
import * as authController from "./../../controllers/v1/authController.js";
import { authenticationMiddleware } from "./../../middlewares/v1/authMiddleware.js"

const router = express.Router();

router.post("/signup", [uploadImage, authRequest.signUpRequest], authController.signUp);
router.post("/login", [authRequest.logInRequest], authController.logIn);
router.post("/refresh", [], authController.refreshToken);
router.post("/forgot-password", [authRequest.forgotPasswordRequest], authController.forgotPassword);
router.post("/reset-password", [authRequest.resetPasswordRequest], authController.resetPassword);

router.use((req, res, next) => authenticationMiddleware(req, res, next, 'User'));

router.post("/logout", [], authController.logOut);

export { router };