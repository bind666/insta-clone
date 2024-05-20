import express from 'express';
import { loginUser, logout, refreshToken, registerUser } from '../controller/user.controller.js';
import { validateLoginUser, validateRegisterUser } from '../middleware/validator.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

//@Route to register user
userRouter.route('/register').post(validateRegisterUser, registerUser)
userRouter.route('/login').post(validateLoginUser, loginUser)

//@protected route
userRouter.route("/refresh").get(refreshToken)

userRouter.route("/logout").delete(auth,logout)

export default userRouter;