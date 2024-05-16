import jwt from "jsonwebtoken";
import config from "../config/config.js";
import createError from "http-errors";

const generateCookies = (payload) => {
    if (!payload || typeof payload !== "object") {
        throw createError(422, "payload required.")
    }
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "8h" })
    const accessToken = jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "24h" })
    return { refreshToken, accessToken }
}

export { generateCookies }