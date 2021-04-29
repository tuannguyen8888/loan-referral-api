import {Controller, Get, Headers, Param, Body} from '@nestjs/common';
import {ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {PtfMasterDataService} from "./ptf-master-data.service";
import {ProductDto, MasterDataDto, SearchMasterDataDto} from "./dto";

@Controller('master-data')
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@ApiTags("PTF Master Data")
export class PtfMasterDataController {
    constructor(private readonly service: PtfMasterDataService) {}
    @Get("/products")
    getProducts(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<ProductDto[]> {
        return this.service.getAllProducts(dto.keyword);
    }

    @Get("/doc-types")
    getDocTypes(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('DOC_TYPE',null,null,dto.keyword);
    }

    @Get("/genders")
    getGenders(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('GENDER',null,null,dto.keyword);
    }
    @Get("/issue-cities")
    getIssueCities(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('ISSUE_CITY',null,null,dto.keyword);
    }
    @Get("/maritial-status")
    getMaritialStatus(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('MARITIAL_STATUS',null,null,dto.keyword);
    }
    @Get("/accompaniment-of-client")
    getAccompanimentOfClient(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('ACCOMPANIMENT_OF_CLIENT',null,null,dto.keyword);
    }
    @Get("/economical-status")
    getEconomicalStatus(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('ECONOMICAL_STATUS',null,null,dto.keyword);
    }
    @Get("/disbursement-method")
    getDisbursementMethod(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('DISBURSEMENT_METHOD',null,null,dto.keyword);
    }
    @Get("/banks")
    getBanks(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('BANK',null,null,dto.keyword);
    }
    @Get("/bank-cities")
    getBankCities(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('BANK_CITY',null,null,dto.keyword);
    }
    @Get("/bank-branches/:bank_id/:bank_city_id")
    getBankBranches(
        @Headers() headers,
        @Param() params,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getBankBranches(params.bank_id?params.bank_id.toString():null, params.bank_city_id?params.bank_city_id.toString():null,dto.keyword);
    }
    @Get("/loan-status")
    getLoanStatus(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getLoanStatus(dto.keyword);
    }
    @Get("/loan-purposes")
    getLoanPurposes(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('LOAN_PURPOSE',null,null,dto.keyword);
    }
    @Get("/educations")
    getEducations(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('EDUCATION',null,null,dto.keyword);
    }
    @Get("/related-persons")
    getRelatedPersons(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('RELATED_PERSON',null,null,dto.keyword);
    }
    @Get("/professions")
    getProfessions(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('PROFESSION',null,null,dto.keyword);
    }
    @Get("/provinces")
    getProvinces(
        @Headers() headers,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('PROVINCE',null,null,dto.keyword);
    }
    @Get("/districts/:province_id")
    getDistricts(
        @Headers() headers,
        @Param() params,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('DISTRICT', params.province_id?params.province_id.toString():null,null,dto.keyword);
    }
    @Get("/wards/:district_id")
    getWards(
        @Headers() headers,
        @Param() params,
        @Body() dto: SearchMasterDataDto
    ): Promise<MasterDataDto[]> {
        return this.service.getMasterDatas('WARD', params.district_id?params.district_id.toString():null,null,dto.keyword);
    }
}
