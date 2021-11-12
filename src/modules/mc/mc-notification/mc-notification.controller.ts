import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import { McNotificationService } from "./mc-notification.service";
import { GetMCnotificationRequestDto } from "./dto/get-notification.request.dto";
import { McNotificationsResponseDto } from "./dto/mc-notifications.response.dto";
import { McNotificationResponseDto } from "./dto/mc-notification.response.dto";
import { McNotificationDto } from "./dto/mc-notification.dto";
import { McNotificationUpdateDto } from "./dto/mc-notification.update.dto";

@Controller("mc-notification")
export class McNotificationController {
  constructor(private readonly service: McNotificationService) {}
  @Get("/")
  @ApiOperation({ summary: "Lấy danh sách Notification" })
  getAllNotifications(
    @Headers() headers,
    @Body() dto: GetMCnotificationRequestDto
  ): Promise<McNotificationsResponseDto> {
    console.log("Lấy danh sách Notification");
    return this.service.getAllNotification(dto);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Lấy chi tiết Notification" })
  getNotification(
    @Headers() headers,
    @Param() params
  ): Promise<McNotificationResponseDto> {
    return this.service.getNotification(params.id);
  }

  @Post("/")
  @ApiOperation({ summary: "Thêm Notification" })
  createNotification(
    @Headers() headers,
    @Body() dto: McNotificationDto
  ): Promise<any> {
    return this.service.createNotification(dto);
  }

  @Put("/")
  @ApiOperation({ summary: "Sửa Notification" })
  updateNotification(
    @Headers() headers,
    @Body() dto: McNotificationUpdateDto
  ): Promise<McNotificationUpdateDto> {
    return this.service.updateNotification(dto);
  }
}
