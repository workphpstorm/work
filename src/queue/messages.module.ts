import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessagesController } from './messages.controller';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { NotificationModule } from '../notification/notification.module';
import {
  NOTIFICATION_QUEUE,
  PRODUCER_QUEUE,
  NOTIFICATION_QUEUE_DLQ,
} from '../notification/types/channel.types';
import { ProduceProcessor } from './processors/produce.processor';
import { MessagesService } from './messages.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationMakerProcessor } from './processors/notification-maker.processor';
import { ErrorHandlerProcessor } from './processors/error-handler.processor';
@Module({
  imports: [
    NotificationModule,
    BullModule.registerQueue(
      // просто список завдань які мають оброблюватись (для тестування)
      // заповняється при старті докера через k6
      // або через api запит /api/produce
      // або через k6 - файл для генераціі ./k6/test.js
      {
        name: PRODUCER_QUEUE,
      },
      //окрема черга для моніторигу завдань які не змогли відпрацювати
      {
        name: NOTIFICATION_QUEUE_DLQ,
      },
      //сюди потрапляють завдання на відправу в різні канали
      {
        name: NOTIFICATION_QUEUE,
      },
    ),
    //дашборд для виводу інформаціі по чергам
    BullBoardModule.forFeature(
      {
        name: NOTIFICATION_QUEUE,
        adapter: BullMQAdapter,
      },
      {
        name: NOTIFICATION_QUEUE_DLQ,
        adapter: BullMQAdapter,
      },
      {
        name: PRODUCER_QUEUE,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [
    MessagesService,
    NotificationService,
    ProduceProcessor,
    NotificationMakerProcessor,
    ErrorHandlerProcessor,
  ],
  exports: [BullModule, NotificationService],
  controllers: [MessagesController],
})
export class MessagesModule {}
