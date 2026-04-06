import { IsString, IsOptional, IsIn } from 'class-validator';

export type ChannelType = 'email' | 'internal' | 'http';

export class NotificationPayloadDto {
  @IsString()
  to: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class SendNotificationDto {
  @IsIn(['email', 'internal', 'http'] satisfies ChannelType[])
  channel: ChannelType;

  payload: NotificationPayloadDto;
}
