import * as redis from "redis";
import * as config from "config";
import { promisify } from "util";
import {
  OnModuleInit,
  Injectable,
  Logger,
  UseFilters,
  HttpException
} from "@nestjs/common";
import { Logger as LoggerUtil } from "../loggers";
import { ErrorFilter } from "../filters";
import { REDIS_UNAVAILABLE } from "../exceptions";

const { host, port, password, expireIn } = config.get("redis");

@UseFilters(ErrorFilter)
@Injectable()
export class RedisClient implements OnModuleInit {
  constructor(private readonly loggerUtil: LoggerUtil) {}

  onModuleInit() {
    this.logger = new Logger("Redis");
    this.client = redis.createClient({
      host,
      port,
      password
    });

    this.client.on("connect", () => {
      this.logger.log("Connected to Redis server");
    });

    this.client.on("reconnecting", () => {
      this.logger.error("Reconnecting to Redis server");
    });

    this.client.on("error", error => {
      switch (error.command) {
        case "AUTH":
          this.logger.error("Authentication error");
          break;

        default:
          this.logger.error("redis client error = ", error);
      }
    });
  }

  private logger: Logger;
  private client: any;

  async set(key: string, value: unknown, expireTime?: number): Promise<string> {
    try {
      return await promisify(this.client.setex).bind(this.client)(
        key,
        expireTime || expireIn,
        value
      );
    } catch (error) {
      this.loggerUtil.logException(REDIS_UNAVAILABLE, error);
      this.loggerUtil.error(REDIS_UNAVAILABLE + error);
      throw new HttpException(
        REDIS_UNAVAILABLE.message,
        REDIS_UNAVAILABLE.code
      );
    }
  }

  async get(key: string): Promise<string> {
    try {
      return await promisify(this.client.get).bind(this.client)(key);
    } catch (error) {
      this.loggerUtil.logException(REDIS_UNAVAILABLE, error);
      throw new HttpException(
        REDIS_UNAVAILABLE.message,
        REDIS_UNAVAILABLE.code
      );
    }
  }

  async getIndex(source: string, value: string): Promise<number> {
    try {
      return await promisify(this.client.lpos).bind(this.client)(source, value);
    } catch (error) {
      this.loggerUtil.logException(REDIS_UNAVAILABLE, error);
      throw new HttpException(
        REDIS_UNAVAILABLE.message,
        REDIS_UNAVAILABLE.code
      );
    }
  }

  async push(key: string, value: unknown): Promise<number> {
    try {
      return await promisify(this.client.rpush).bind(this.client)(key, value);
    } catch (error) {
      this.loggerUtil.logException(REDIS_UNAVAILABLE, error);
      throw new HttpException(
        REDIS_UNAVAILABLE.message,
        REDIS_UNAVAILABLE.code
      );
    }
  }

  async shift(key: string): Promise<string> {
    try {
      return await promisify(this.client.lpop).bind(this.client)(key);
    } catch (error) {
      this.loggerUtil.logException(REDIS_UNAVAILABLE, error);
      throw new HttpException(
        REDIS_UNAVAILABLE.message,
        REDIS_UNAVAILABLE.code
      );
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      return await promisify(this.client.del).bind(this.client)(key);
    } catch (error) {
      this.loggerUtil.logException(REDIS_UNAVAILABLE, error);
      throw new HttpException(
        REDIS_UNAVAILABLE.message,
        REDIS_UNAVAILABLE.code
      );
    }
  }
}
