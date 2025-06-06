import winston from 'winston';
import config from '../config';
import { TransformableInfo } from 'logform';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const customFormat = printf((info: TransformableInfo) => {
    let message = `${info.timestamp} [${info.level}]: ${info.message}`;

    if (info.stack) {
        message += `\n${info.stack}`;
    }

    return message;
});

const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [

        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                customFormat
            )
        }),

        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),

        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ],

    exitOnError: false
});

if (process.env.NODE_ENV !== 'test') {
    logger.exceptions.handle(
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    );
}

export default logger;