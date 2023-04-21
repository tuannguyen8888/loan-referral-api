import * as os from "os";
import * as Stomp from "stompjs";
import * as config from "config";
import { OnModuleInit, Injectable, Logger, UseFilters } from "@nestjs/common";
import { WebhookService } from "src/common/modules/webhook/webhook.service";
import { Source } from "src/common/modules/webhook/enums";
import { ErrorFilter, HttpExceptionFilter } from "src/common/filters";
import { MessagesHeaders, MessagesBody } from "src/common/interfaces";
import { MessageBody } from "src/common/modules/webhook/interfaces";

const { client, server, queues } = config.get("activemq");

@Injectable()
@UseFilters(ErrorFilter, HttpExceptionFilter)
export class StompClient implements OnModuleInit {
  constructor(private readonly webhookService: WebhookService) {}

  async onModuleInit() {
    this.logger = new Logger("ActiveMQ");
    this.client = Stomp.overTCP(server.host, server.port);
    this.client.connect(
      {
        login: server.login,
        passcode: server.passcode,
        // additional header
        "client-id": client
      },
      () => {
        this.logger.log("Connected to ActiveMQ server");
        this.subscribeToEwalletNotifications(queues.ewalletNotification);
      },
      error => {
        this.logger.error(error);
      }
    );
  }

  private logger: Logger;
  private client: any;

  publish(queue: string, body: MessagesBody, headers?: MessagesHeaders): void {
    this.client.send(`${queue}${os.hostname()}`, headers, JSON.stringify(body));
  }

  subscribeToEwalletNotifications(queue: string): void {
    this.client.subscribe(
      queue,
      async (message: Stomp.Message) => {
        const body: MessageBody = JSON.parse(message.body);
        if (body.source === Source.OECO) {
          await this.webhookService.sendNotification(body);
        }
        message.ack();
      },
      { ack: "client" }
    );
  }
}
