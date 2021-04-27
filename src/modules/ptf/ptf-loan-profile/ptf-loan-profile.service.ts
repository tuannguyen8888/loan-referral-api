import { Injectable } from '@nestjs/common';

import {GetPtfLoanProfilesRequestDto, LoanProfileResponseDto, LoanProfilesResponseDto, LoanProfileDto} from "./dto";
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

    async checkCustomerInfo(customerNationalId, phone, taxCode = null) {
        let response: any = {
            success: true
        };
        if (response.success) {
            response.statusCode = 200;
        } else {
            response.statusCode = 400;
        }
        return response;
    }

    async createLoanProfile(dto: LoanProfileDto) {
        return new Promise<LoanProfileDto>(()=>{
            return new LoanProfileDto();
        });
    }
    async updateLoanProfile(dto: LoanProfileDto) {
        return new Promise<LoanProfileDto>(()=>{
            return new LoanProfileDto();
        });
    }

}
