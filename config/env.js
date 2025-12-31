import {config} from 'dotenv'
config( {path: `.env.${process.env.NODE_ENV || 'development'}.local`});
export const {
    PORT, 
    NODE_ENV, 
    DB_URI, 
    JWT_SECRET = "secret", 
    JWT_EXPIRES_IN = "1d",
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM
}=process.env;