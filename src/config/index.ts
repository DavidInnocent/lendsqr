import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306'),
    DB_USER: process.env.DB_USER || 'lendsqr_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'Qwertyiop9059@',
    DB_NAME: process.env.DB_NAME || 'lendsqr_wallet',
    ADJUTOR_API_KEY: process.env.ADJUTOR_API_KEY || 'sk_live_KkvpeXyKpYHvz5ZvKB8cfkLKR95iOCGHmj2APv8E',
    ADJUTOR_BASE_URL: process.env.ADJUTOR_BASE_URL || 'https://adjutor.lendsqr.com',
    JWT_SECRET: process.env.JWT_SECRET || 'lendsqr_secret',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};