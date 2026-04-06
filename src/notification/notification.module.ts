import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailChannel } from './channels/email.channel';
import { HttpChannel } from './channels/http.channel';
import {
  NOTIFICATION_CHANNELS,
  NotificationChannelMap,
} from './interfaces/notification-channel.interface';
import { HttpModule } from '@nestjs/axios';
import { InternalChannel } from './channels/internal.channel';
import { ErrorNotifyDatabase } from './channels/error-notify-database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLogEntity } from './entities/error.log';
@Module({
  providers: [
    EmailChannel,
    NotificationService,
    HttpChannel,
    InternalChannel,
    ErrorNotifyDatabase,
    {
      provide: NOTIFICATION_CHANNELS,
      useFactory: (
        email: EmailChannel,
        http: HttpChannel,
        internal: InternalChannel,
        errorNotifyDatabase: ErrorNotifyDatabase,
      ): NotificationChannelMap => ({
        email,
        http,
        internal,
        errorNotifyDatabase,
      }),
      inject: [EmailChannel, HttpChannel, InternalChannel, ErrorNotifyDatabase],
    },
  ],
  exports: [NotificationService, NOTIFICATION_CHANNELS],
  imports: [HttpModule, TypeOrmModule.forFeature([ErrorLogEntity])],
})
export class NotificationModule {}
