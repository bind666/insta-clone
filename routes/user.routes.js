import express from 'express';
import { loginUser, registerUser } from '../controller/user.controller.js';
import { validateLoginUser, validateRegisterUser } from '../middleware/validator.js';

const userRouter = express.Router();

userRouter.route('/register').post(validateRegisterUser, registerUser)
userRouter.route('/login').post(validateLoginUser, loginUser)


export default userRouter;