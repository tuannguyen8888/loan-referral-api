import {Controller, Get, Headers, Param} from '@nestjs/common';
import {ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {PtfMasterDataService} from "./ptf-master-data.service";
import {ProductDto, MasterDataDto} from "./dto";

@Controller('master-data')
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@ApiTags("PTF Master Data")
export class PtfMasterDataController {
    constructor(private readonly service: PtfMasterDataService) {}
    @Get("/products/:keyword")
    getProducts(
        @Headers() headers,
        @Param() params
    ): Promise<ProductDto[]> {
        return this.service.getAllProducts(params.keyword);
    }
    @Get("/genders/:keyword")
    getGenders(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('GENDER',null,null,params.keyword);
    }
    @Get("/issue-cities/:keyword")
    getIssueCities(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('ISSUE_CITY',null,null,params.keyword);
    }
    @Get("/maritial-status/:keyword")
    getMaritialStatus(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('MARITIAL_STATUS',null,null,params.keyword);
    }
    @Get("/accompaniment-of-client/:keyword")
    getAccompanimentOfClient(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('ACCOMPANIMENT_OF_CLIENT',null,null,params.keyword);
    }
    @Get("/economical-status/:keyword")
    getEconomicalStatus(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('ECONOMICAL_STATUS',null,null,params.keyword);
    }
    @Get("/disbursement-method/:keyword")
    getDisbursementMethod(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('DISBURSEMENT_METHOD',null,null,params.keyword);
    }
    @Get("/banks/:keyword")
    getBanks(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('BANK',null,null,params.keyword);
    }
    @Get("/bank-cities/:keyword")
    getBankCities(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('BANK_CITY',null,null,params.keyword);
    }
    @Get("/bank-branches/:bank_id/:bank_city_id/:keyword")
    getBankBranches(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getBankBranches(params.bank_id?params.bank_id.toString():null, params.bank_city_id?params.bank_city_id.toString():null,params.keyword);
    }
    @Get("/loan-status/:keyword")
    getLoanStatus(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getLoanStatus(params.keyword);
    }
    @Get("/loan-purposes/:keyword")
    getLoanPurposes(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('LOAN_PURPOSE',null,null,params.keyword);
    }
    @Get("/educations/:keyword")
    getEducations(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('EDUCATION',null,null,params.keyword);
    }
    @Get("/related-persons/:keyword")
    getRelatedPersons(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('RELATED_PERSON',null,null,params.keyword);
    }
    @Get("/professions/:keyword")
    getProfessions(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('PROFESSION',null,null,params.keyword);
    }
    @Get("/provinces/:keyword")
    getProvinces(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('PROVINCE',null,null,params.keyword);
    }
    @Get("/districts/:province_id/:keyword")
    getDistricts(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('DISTRICT', params.province_id?params.province_id.toString():null,null,params.keyword);
    }
    @Get("/wards/:district_id/:keyword")
    getWards(
        @Headers() headers,
        @Param() params
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('WARD', params.province_id?params.province_id.toString():null,null,params.keyword);
    }
}
