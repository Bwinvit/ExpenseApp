// logger.mjs

import winston from "winston";
import expressWinston from "express-winston";

// Define log levels and colors
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "blue",
    debug: "green",
});

// Create a Winston logger
const logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize(), // Apply colorization
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
    ],
});

// Create an express-winston logger to log HTTP requests
const expressLogger = expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}}",
});

export { logger, expressLogger };
