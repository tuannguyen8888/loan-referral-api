import { HttpStatus } from "@nestjs/common";

export const REQUEST_CONFLICT = {
  code: HttpStatus.CONFLICT,
  details: "Conflict request ID"
};
