import { OnWorkerEvent, Processor } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from '../../notification/types/channel.types';
import { Job } from 'bullmq';
import { SendNotificationDto } from '../dto/queue.dto';
import { BaseProcessor } from './base.processor';

@Processor(NOTIFICATION_QUEUE)
// процесор який відповідає за те щоб вибирати данні з черги на відправку і відправляти іх в різні канали
export class NotificationMakerProcessor extends BaseProcessor {
  async process(job: Job<SendNotificationDto>): Promise<void> {
    const { channel, payload } = job.data;
    const attempt = job.attemptsMade + 1;
    await this.info(job, `Attempt ${attempt}: sending...`, 50);
    await this.notificationService.send(channel, payload);
    await this.info(job, `Attempt ${attempt}: successfully`, 100);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<SendNotificationDto>, error: Error) {
    this.logger.error(
      `JobID: ${job.id} error: ${error.message} attepts: ${job.attemptsMade} allAttempts: ${job.opts.attempts}`,
    );
    if (job.attemptsMade == job.opts.attempts) {
      await this.dlq.add(
        'failed-task',
        {
          originalJobId: job.id,
          originalJobName: job.name,
          data: job.data,
          error: error.message,
          stack: error.stack,
          attemptsMade: job.attemptsMade,
          failedAt: new Date().toISOString(),
        },
        { removeOnComplete: false, removeOnFail: false, attempts: 2 },
      );
    }
  }
}
