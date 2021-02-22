import * as crypto from "crypto";
import { Request } from "express";
import { HttpException, Injectable } from "@nestjs/common";
import {
  REQUEST_INVALID_PARTNER_CODE,
  REQUEST_INVALID_CHECKSUM,
  REQUEST_INVALID_PARTNER
} from "src/common/exceptions";
import { RedisClient } from "../shared";
import { getConnection } from "typeorm";
import { Partner } from "../../entities";
import { PartnerRepository } from "../../repositories";

@Injectable()
export class CheckPartnerService {
  constructor(protected readonly redisClient: RedisClient) {}

  async checkPartnerCodeAndChecksum(
    req: Request,
    partnerCode: unknown,
    apiPath: string,
    body: unknown,
    checksum: unknown
  ): Promise<boolean> {
    if (!partnerCode) {
      throw new HttpException(
        REQUEST_INVALID_PARTNER_CODE.message,
        REQUEST_INVALID_PARTNER_CODE.code
      );
    }
    if (!checksum) {
      throw new HttpException(
        REQUEST_INVALID_CHECKSUM.message,
        REQUEST_INVALID_CHECKSUM.code
      );
    }
    let partnerCache;
    let partner: Partner;
    try {
      partnerCache = await this.redisClient.get(
        "loan_referral_partner_" + partnerCode
      );
      if (partnerCache) {
        partner = Object.assign(
          new Partner(),
          JSON.parse(
            await this.redisClient.get("loan_referral_partner_" + partnerCode)
          )
        );
      } else {
        let connection = getConnection("default");
        partner = await connection
          .getCustomRepository(PartnerRepository)
          .findOne({ where: { code: partnerCode } });
        if (partner) {
          await this.redisClient.set(
            "loan_referral_partner_" + partnerCode,
            JSON.stringify(partner)
          );
        }
      }
    } catch (e) {
      console.log(e);
    }

    if (!partner) {
      throw new HttpException(
        REQUEST_INVALID_PARTNER.message,
        REQUEST_INVALID_PARTNER.code
      );
    }
    const str_before_hash = apiPath + JSON.stringify(body) + partner.secretKey;
    const hash_sha256 = crypto
      .createHash("sha256")
      .update(str_before_hash)
      .digest("hex");
    if (checksum != hash_sha256) {
      const exection = new HttpException(
        REQUEST_INVALID_CHECKSUM.message,
        REQUEST_INVALID_CHECKSUM.code
      );
      // const fakeRequest = {
      //   request_id: body["req_id"] || req.headers["x-Request-id"],
      //   ip_address: req.ip,
      //   time: new Date().getTime(),
      //   api_link: apiPath,
      //   headers: JSON.stringify(req.headers),
      //   body: JSON.stringify(body),
      //   response: JSON.stringify(exection.getResponse()),
      //   is_fake_request: true
      // };
      // this.mutationRepository.request.insertFakeRequest(fakeRequest);
      throw exection;
    }
    return true;
  }
}
