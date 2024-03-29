import express from 'express';
import { router as authRouter } from './auth.js';
import { router as userRouter } from './user.js';
const router = express.Router();

router.use('/v1', authRouter);
router.use('/v1/user', userRouter);

export { router };