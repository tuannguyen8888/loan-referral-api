import { HttpStatus } from "@nestjs/common";
import { BaseException } from "src/common/interfaces";

export const REDIS_UNAVAILABLE: BaseException = {
  code: HttpStatus.SERVICE_UNAVAILABLE,
  message: `An error occurred. Please try again later`
};
