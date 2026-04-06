import type { ChannelType } from '../types/channel.types';
export const NOTIFICATION_CHANNELS = 'NOTIFICATION_CHANNELS';

export interface NotificationPayload {
  to: string;
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export type NotificationChannelMap = Record<ChannelType, INotificationChannel>;

export interface INotificationChannel {
  send(payload: any): Promise<void>;
}
