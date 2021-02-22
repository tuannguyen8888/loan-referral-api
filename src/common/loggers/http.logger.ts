import * as config from "config";
import * as winston from "winston";
import { OnModuleInit } from "@nestjs/common";
import { BaseException } from "src/common/interfaces";

const logsConfig = config.get("logs");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: `${
        logsConfig.directory
      }/server-${new Date().toDateString()}.log`,
      level: "verbose",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: `${
        logsConfig.directory
      }/error-${new Date().toDateString()}.log`,
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      )
    })
  ]
});

export class DebugStream {
  write(message: string): void {
    logger.debug(message);
  }
}

export class ProductionStream {
  write(message: string): void {
    logger.info(message);
  }
}

export class Logger implements OnModuleInit {
  onModuleInit(): void {
    this.logger = logger;
  }

  private logger: winston.Logger;

  info(message: unknown): void {
    this.logger.info(message);
  }

  verbose(message: unknown): void {
    this.logger.verbose(message);
  }

  error(message: unknown): void {
    this.logger.error(message);
  }

  logTrace(requestId: string, data: unknown): void {
    this.logger.info(
      JSON.stringify({
        requestId,
        data
      })
    );
  }

  logException(exception: BaseException, data: unknown): void {
    this.logger.error(
      JSON.stringify({
        exception,
        data
      })
    );
  }
}
