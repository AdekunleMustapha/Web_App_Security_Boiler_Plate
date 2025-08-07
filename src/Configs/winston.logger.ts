import { createLogger, transports, format, Logger } from "winston";
import { ENV } from "./env";
import { Service } from "typedi";

@Service()
export class LoggerService {
  private logger: Logger;

  constructor() {
    const customTransports = [];

    if (ENV === "production") {
      customTransports.push(
        new transports.File({
          level: "error",
          filename: "error.log",
          format: format.combine(format.timestamp(), format.json()),
        }),
      );

      customTransports.push(
        new transports.File({
          level: "info",
          filename: "application.log",
          format: format.combine(format.timestamp(), format.json()),
        }),
      );
    } else {
      customTransports.push(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: "HH:mm:ss" }),
            format.printf(({ timestamp, level, message }) => {
              return `${timestamp} ${level}: ${message}`;
            }),
          ),
        }),
      );
    }

    this.logger = createLogger({
      level: "info",
      transports: customTransports,
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}
