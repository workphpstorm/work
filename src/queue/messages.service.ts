import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { JobsOptions, Queue } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../notification/types/channel.types';
import { SendNotificationDto } from './dto/queue.dto';
import { DeliveryChannelEnum } from './enums/delivery.channel.enum';
import { createHash } from 'crypto';

@Injectable()
export class MessagesService {
  constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly queue: Queue) {}

  async produce(data: SendNotificationDto) {
    const channel = data.channel as DeliveryChannelEnum;

    await this.queue.add(
      'deliver',
      {
        channel: data.channel,
        payload: data.payload,
        idempotencyKey: this.createIdempotencyKey(data.payload),
      },
      this.getJobOptions(channel),
    );
  }

  private getJobOptions(channel: DeliveryChannelEnum): JobsOptions {
    switch (channel) {
      case DeliveryChannelEnum.EMAIL:
        return this.config('exponential', 5000, false, false, 4);

      case DeliveryChannelEnum.HTTP:
        return this.config('exponential', 2000, false, false, 6);

      case DeliveryChannelEnum.INTERNAL:
        return this.config('fixed', 1000, false, false, 2);

      default:
        return this.config('fixed', 5000, false, false, 4);
    }
  }

  private config(
    type: string,
    delay: number,
    removeOnComplete: boolean,
    removeOnFail: boolean,
    attempts: number,
  ) {
    return {
      attempts: attempts,
      backoff: {
        type: type,
        delay: delay,
      },
      removeOnComplete: removeOnComplete,
      removeOnFail: removeOnFail,
    };
  }

  private createIdempotencyKey(payload) {
    const normalized = JSON.stringify(payload);
    return createHash('sha256').update(normalized).digest('hex');
  }
}
