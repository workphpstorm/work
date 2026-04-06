export const CHANNEL_TYPES = [
  'email',
  'http',
  'internal',
  'errorNotifyDatabase',
] as const;
export type ChannelType = (typeof CHANNEL_TYPES)[number];
export const PRODUCER_QUEUE = 'producer';
export const NOTIFICATION_QUEUE_DLQ = 'dlq';
export const NOTIFICATION_QUEUE = 'notification';
