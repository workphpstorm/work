import { Injectable } from '@nestjs/common';
import { NotificationPayload } from '../interfaces/notification-channel.interface';
import { BaseChannel } from './base.channel';

@Injectable()
export class HttpChannel extends BaseChannel {
  send(payload: NotificationPayload): Promise<any> {
    //зроблене для того щоб реально протестити чи працюють черги ретраі
    this.randomException();
    this.logger.info(`Sending http to ${payload.to}`);

    return Promise.resolve();
  }
}
