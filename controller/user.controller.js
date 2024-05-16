import userModel from "../model/userModel.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import bcrypt from "bcrypt";
import { generateCookies } from "../utils/utils.js";


const registerUser = asyncHandler(async (req, res, next) => {
    const isUser = await userModel.findOne({ email: req.body.email })
    if (isUser) {
        return next(createError(408, "user already exists"))
    }
    const user = await userModel.create(req.body)
    res.status(200).json(new ApiResponse(user, "user registerd sucessfully"))
})

const loginUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(createError(404, "Invalid Credintials."));
    }

    const isPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isPassword) {
        return next(createError(401, "Invalid credintials."));
    }

    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email
    }

    const { refreshToken, accessToken } = generateCookies(payload)

    res.status(200)
        .cookie("refreshToken", refreshToken)
        .cookie("accessToken", accessToken)
        .json(new ApiResponse(user, "user Login sucessfully"))

    
})

export { registerUser, loginUser };


