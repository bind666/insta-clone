import jwt from "jsonwebtoken";
import config from "../config/config.js";
import createError from "http-errors";

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

export { generateCookies, verifyToken, checkTokenExpiry }