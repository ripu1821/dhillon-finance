/**
 * Logger Configuration
 */

import winston from "winston";
import dailyRotateFileTransport from "winston-daily-rotate-file";

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new dailyRotateFileTransport({
      level: "error",
      filename: "EZ-error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      dirname: "logs/errorLogs",
    }),
    new dailyRotateFileTransport({
      level: "info",
      filename: "EZ-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      dirname: "logs",
    }),
  ],
});

const consoleLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp }) => {
    if (typeof message === "object" && message !== null) {
      // Serialize the JSON object into a string
      message = JSON.stringify(message, null, 2); // Indent for better readability
    }
    return `[${timestamp}] ${level}: ${message}`;
  })
);
if ("development" === process.env.NODE_ENV) {
  logger.add(
    new winston.transports.Console({
      format: consoleLogFormat,
    })
  );
}

export default logger;
