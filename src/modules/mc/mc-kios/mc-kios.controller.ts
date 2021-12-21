import { Body, Controller, Get, Headers } from "@nestjs/common";
import { McLoanProfileService } from "../mc-loan-profile/mc-loan-profile.service";
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import { McKiosResponseDto } from "../mc-kios/dto";
import { McKiosService } from "./mc-kios.service";
import { McKiosRepository } from "../../../repositories";

@Controller("mc-kios")
export class McKiosController {
  constructor(private readonly service: McKiosService) {}

  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách kios" })
  getKios(@Headers() headers): Promise<McKiosRepository> {
    console.log("Lấy danh sách kios");
    return this.service.getKios();
  }
}
