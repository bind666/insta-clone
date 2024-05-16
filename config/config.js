import dotenv from 'dotenv';

dotenv.config()

const config = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET
}

export default config