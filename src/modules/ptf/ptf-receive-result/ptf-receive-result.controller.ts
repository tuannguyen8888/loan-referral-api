import { Controller } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

@Controller("receive-result")
@ApiSecurity("api-key")
@ApiSecurity("checksum")
@ApiTags("PTF Receive Result")
export class PtfReceiveResultController {}
