import {
  Headers,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { ApiTags, ApiSecurity } from "@nestjs/swagger";
import { LoanProfileService } from "./loan-profile.service";
import {
  GetLoanProfilesRequestDto,
  LoanProfilesResponseDto,
  LoanProfileDto
} from "./dto";

@ApiTags("Loan profile")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@Controller("loan-profile")
export class LoanProfileController {
  constructor(private readonly service: LoanProfileService) {}

  @Get("/")
  getLoanProfiles(
    @Headers() headers,
    @Body() dto: GetLoanProfilesRequestDto
  ): Promise<LoanProfilesResponseDto> {
    return this.service.getAllLoanProfiles(dto);
  }

  @Get("/:loan_profile_id")
  getLoanProfile(@Headers() headers, @Param() params): Promise<LoanProfileDto> {
    return this.service.getLoanProfile(params.loan_profile_id);
  }

  @Post("/")
  registration(
    @Headers() headers,
    @Body() dto: LoanProfileDto
  ): Promise<LoanProfileDto> {
    return this.service.createLoanProfile(dto);
  }
}
