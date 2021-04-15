import "reflect-metadata";
import * as config from "config";
import * as fs from "fs";
import * as hbs from "hbs";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as rateLimit from "express-rate-limit";
import * as morgan from "morgan";
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestApplicationOptions, Logger, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { getThemeName } from "./common/helpers";
import { DebugStream, ProductionStream } from "./common/loggers";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
// import {MasterDataModule, MemberModule, TransactionModule} from "./modules";

async function bootstrap() {
  const enviroment = process.env.NODE_ENV;
  const whitelistUrls = ["https://dps-staging.napas.com.vn"];
  const serverConfig = config.get("server");
  const securityConfig = config.get("security");
  const { ssl, rateLlmit } = securityConfig;
  const logger = new Logger("Server");
  const option: NestApplicationOptions = {};
  if (ssl.active) {
    option.httpsOptions = {
      key: fs.readFileSync(join(__dirname, ssl.key), "utf8"),
      ca: fs.readFileSync(join(__dirname, ssl.ca), "utf8"),
      cert: fs.readFileSync(join(__dirname, ssl.cert), "utf8")
    };
  }
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    option
  );
  // app.useGlobalInterceptors(new ParseResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(
    helmet({
      referrerPolicy: {
        policy: ["same-origin"]
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [...whitelistUrls, "'self'"],
          scriptSrc: [
            ...whitelistUrls,
            "'self'",
            "'unsafe-eval'",
            "'unsafe-inline'"
          ],
          styleSrc: [...whitelistUrls, "'self'", "'unsafe-inline'"]
        }
      }
    })
  );
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: rateLlmit.resetAfter,
      max: rateLlmit.maxRequest,
      message: "Too many request from this IP, please try again after"
    })
  );
  app.set("trust proxy", 1);
  if (enviroment === "development") {
    app.use(morgan("combined", { stream: new DebugStream() }));
  } else {
    app.use(morgan("combined", { stream: new ProductionStream() }));
  }
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views/layouts'));
  // hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  // hbs.registerPartials(join(__dirname, '..', 'views/themes'));
  // hbs.registerHelper('theme', (context, options) =>
  //   getThemeName(context, options),
  // );
  // app.setViewEngine('hbs');

  const options = new DocumentBuilder()
    .setTitle("Loan Referral Swagger")
    .setDescription("The Loan Referral API description")
    .setVersion("1.0")
    .addApiKey(
      {
        type: "apiKey", // this should be apiKey
        name: "X-PARTNER-CODE", // this is the name of the key you expect in header
        in: "header"
      },
      "api-key" // this is the name to show and used in swagger
    )
    .addApiKey(
      {
        type: "apiKey", // this should be apiKey
        name: "checksum", // this is the name of the key you expect in header
        description: "checksum = sha256(path + body_request + secret_key)",
        in: "header"
      },
      "checksum" // this is the name to show and used in swagger
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/", app, document);
  SwaggerModule.setup("/api", app, document);

  // useContainer(app.select(AppModule), { fallbackOnErrors: true, fallback: true});
  // useContainer(app.select(MasterDataModule), { fallbackOnErrors: true, fallback: true });
  // useContainer(app.select(MemberModule), { fallbackOnErrors: true, fallback: true });
  // useContainer(app.select(TransactionModule), { fallbackOnErrors: true, fallback: true });
  // useContainer(Container);
  // let validator = Container.get(Validator);
  await app.listen(serverConfig.port, () => {
    logger.log(
      `Server started with ${enviroment} enviroment on port ${serverConfig.port}`
    );
  });
}

bootstrap();
