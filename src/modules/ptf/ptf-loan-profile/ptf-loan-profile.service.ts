import { Injectable } from '@nestjs/common';

import {GetPtfLoanProfilesRequestDto, LoanProfileResponseDto, LoanProfilesResponseDto} from "./dto";
@Injectable()
export class PtfLoanProfileService {

    async getAllLoanProfiles(dto: GetPtfLoanProfilesRequestDto) {
        return new Promise<LoanProfilesResponseDto>(()=>{
            return new LoanProfilesResponseDto();
        });
    }

    async getLoanProfile(loanProfileId: number) {
        return new Promise<LoanProfileResponseDto>(()=>{
            return new LoanProfileResponseDto();
        });
    }
}
