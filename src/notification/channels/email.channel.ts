import { Injectable } from '@nestjs/common';
import { NotificationPayload } from '../interfaces/notification-channel.interface';
import { BaseChannel } from './base.channel';

@Injectable()
export class EmailChannel extends BaseChannel {
  send(payload: NotificationPayload): Promise<any> {
    //зроблене для того щоб реально протестити чи працюють черги та ретраі при навантажені
    this.randomException();
    this.logger.info(`Sending email to ${payload.to}`);

    return Promise.resolve();
  }
}
