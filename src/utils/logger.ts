// src/utils/logger.ts
import winston from 'winston';
import config from '../config';
import { TransformableInfo } from 'logform';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom format that includes error stack traces when available
const customFormat = printf((info: TransformableInfo) => {
    let message = `${info.timestamp} [${info.level}]: ${info.message}`;
    
    if (info.stack) {
        message += `\n${info.stack}`;
    }
    
    return message;
});

// Create the logger instance
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }), // Enables stack traces for errors
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports: [
        // Console transport with colorization
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                customFormat
            )
        }),
        // File transport for error logs
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // File transport for all logs
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ],
    // Don't exit on handled exceptions
    exitOnError: false
});

// Add exception handling
if (process.env.NODE_ENV !== 'test') {
    logger.exceptions.handle(
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    );
}

export default logger;