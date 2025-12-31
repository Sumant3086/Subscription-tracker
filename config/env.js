import {config} from 'dotenv'
config( {path: `.env.${process.env.NODE_ENV || 'development'}.local`});
export const {
    PORT, 
    NODE_ENV, 
    DB_URI, 
    JWT_SECRET = "fallback-secret-key", 
    JWT_EXPIRES_IN = "7d"
}=process.env;