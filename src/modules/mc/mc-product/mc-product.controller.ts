import { Body, Controller, Get, Headers } from "@nestjs/common";
import { McLoanProfileService } from "../mc-loan-profile/mc-loan-profile.service";
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiSecurity,
    ApiTags
} from "@nestjs/swagger";
import { McProductResponseDto } from "../mc-product/dto";
import { McProductService } from "./mc-product.service";
import { McProductRepository } from "../../../repositories";

@Controller('mc-product')
export class McProductController {
    constructor(private readonly service: McProductService) {}

    @Get("/")
    @ApiOperation({ summary: "Lấy danh sách kios" })
    getProducts(@Headers() headers): Promise<McProductRepository> {
        console.log("Lấy danh sách product");
        return this.service.getProducts();
    }
}
