import { Processor } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE_DLQ } from '../../notification/types/channel.types';
import { Job } from 'bullmq';
import { BaseProcessor } from './base.processor';
import { ErrorLogJobDto } from '../../utils/types';

@Processor(NOTIFICATION_QUEUE_DLQ)
// процесор який відповідає за те щоб вибирати данні з зафейленой черги і відправити нотифікацію в базу данних
export class ErrorHandlerProcessor extends BaseProcessor {
  async process(job: Job<ErrorLogJobDto>): Promise<void> {
    const attempt = job.attemptsMade + 1;
    await this.info(job, `Attempt ${attempt}: save error log to db...`, 50);
    await this.notificationService.send('errorNotifyDatabase', job.data);
    await this.info(job, `Attempt ${attempt}: saved to db`, 100);
  }
}
