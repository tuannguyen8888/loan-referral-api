import { HttpStatus } from "@nestjs/common";
import { BaseException } from "src/common/interfaces";

export const REQUEST_INVALID_PARTNER_CODE: BaseException = {
  code: HttpStatus.FORBIDDEN,
  message: `Invalid Partner Code`
};

export const REQUEST_INVALID_CHECKSUM: BaseException = {
  code: HttpStatus.FORBIDDEN,
  message: `Invalid checksum`
};

export const REQUEST_INVALID_PARTNER: BaseException = {
  code: HttpStatus.FORBIDDEN,
  message: `Partner does not exist or has been blocked`
};
