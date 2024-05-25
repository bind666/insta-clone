import jwt from "jsonwebtoken";
import config from "../config/config.js";
import createError from "http-errors";
import asyncHandler from "express-async-handler"
import path from "path"
import cloudinary from "../config/cloudinary.js"
import fs from "fs"
import { promises } from "dns";

const generateCookies = (payload) => {
    if (!payload || typeof payload !== "object") {
        throw createError(422, "payload required.")
    }
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "24h" })
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "8h" })
    return { refreshToken, accessToken }
}

const verifyToken = async (token) => {
    return await jwt.decode(token, config.JWT_ACCESS_TOKEN_SECRET);
}

const checkTokenExpiry = (time) => {
    const totalTime = time * 1000;

    const expiryTime = new Date(totalTime)
    const today = new Date();

    // console.log(expiryTime.toLocaleString());
    // console.log(today.toLocaleString());
    if (expiryTime > today) {
        return false
    } else {
        return true
    }
}

//for uploading the file
const fileUploader = async (file) => {
    if (!file) {
        throw createError(422, "File required.")
    }

    const uploadPath = path.join(process.cwd(), 'uploads', file.name);
    return new Promise((resolve, reject) => {
        file.mv(uploadPath, async (err) => {
            if (err) {
                throw createError(422, err.message)
            } else {
                try {
                    const cloudinaryResult = await cloudinary.uploader.upload(uploadPath, { folder: "insta-clone" });
                    fs.unlink(uploadPath, (err) => {
                        if (err) {
                            throw createError(500, err.message)
                        }
                        console.log("File deleted.");
                    })
                    resolve(cloudinaryResult)
                } catch (error) {
                    reject(error)
                }
            }
        });
    })

}

const fileRemover = async (key) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!key) {
                throw createError(422, "Key required.")
            }
            // ezca5divayrzdbz1nq6h publicKey
            await cloudinary.api.delete_resources([`insta-clone/${key}`],
                { type: 'upload', resource_type: 'image' })

            resolve(true)
        } catch (error) {
            reject(false)
            throw createError(409, error.message)
        }
    })

}

export { generateCookies, verifyToken, checkTokenExpiry, fileUploader, fileRemover }