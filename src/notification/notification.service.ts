// notification/notification.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  INotificationChannel,
  NOTIFICATION_CHANNELS,
} from './interfaces/notification-channel.interface';
import { ChannelType } from './types/channel.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class NotificationService {
  private readonly channelMap: Map<ChannelType, INotificationChannel>;

  constructor(
    @Inject(NOTIFICATION_CHANNELS)
    channels: Record<ChannelType, INotificationChannel>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.channelMap = new Map(
      Object.entries(channels) as [ChannelType, INotificationChannel][],
    );
  }
  async send(channel: ChannelType, payload: any): Promise<void> {
    const ch = this.channelMap.get(channel);
    if (!ch) {
      throw new Error(`Unknown notification channel: ${channel}`);
    }
    await ch.send(payload);
    this.logger.info(`Notification sent via ${channel}`);
  }
}
