import winston from "winston";
import moment from "moment";
import 'winston-daily-rotate-file';

let currentLogLevel = "error";

const fileRotateTransport = new winston.transports.DailyRotateFile({
    level: currentLogLevel,
    filename: 'logs/log-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: null, // or set a large value to avoid rotation based on file count
    // maxFiles: '1d',
});

const logger = winston.createLogger({
    level: currentLogLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, stack, req }) => {
            let logMessage = ``;
            if (Object.keys(req)) {
                const requestURL = req.protocol + "://" + req.get('host') + req.originalUrl;
                const requestBody = JSON.stringify(req.body);
                logMessage += `\n[${timestamp}] API URL: ${requestURL}`;
                logMessage += `\n[${timestamp}] API PARAMETER:  ${requestBody}`;
            }
            logMessage += `\n[${timestamp}] ${level.toUpperCase()}: ${message}`;
            if (stack) {
                logMessage += `\n[${timestamp}] ${level.toUpperCase()}: ${stack}`;
            }
            return logMessage;
        })
    ),
    transports: [
        fileRotateTransport
    ],
});

export const logMessage = (error, req = {}, level = "error") => {
    currentLogLevel = level;
    fileRotateTransport.level = level;
    logger.level = level;
    logger.log(level, error?.message ?? error, { stack: error?.stack ?? '', req: req ?? {} });
};
