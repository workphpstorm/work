import { InjectQueue, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { MessagesService } from '../messages.service';
import { NOTIFICATION_QUEUE_DLQ } from '../../notification/types/channel.types';
import { NotificationService } from '../../notification/notification.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

export abstract class BaseProcessor extends WorkerHost {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE_DLQ)
    protected readonly dlq: Queue,
    protected readonly messageService: MessagesService,
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    protected readonly notificationService: NotificationService,
  ) {
    super();
  }
  abstract process(job: Job<unknown>): Promise<any>;

  async info<T>(job: Job<T>, text: string, updateProgress: number) {
    await job.updateProgress(updateProgress);
    await job.log(text);
  }
}
