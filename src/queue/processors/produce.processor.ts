import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { PRODUCER_QUEUE } from '../../notification/types/channel.types';
import { SendNotificationDto } from '../dto/queue.dto';
import { BaseProcessor } from './base.processor';

@Processor(PRODUCER_QUEUE)
// процесор який відповідає за те щоб витягнути данні зі своєі черги
// створює задачі для відправки по email/internal/http
export class ProduceProcessor extends BaseProcessor {
  async process(job: Job<SendNotificationDto>): Promise<void> {
    const attempt = job.attemptsMade + 1;
    await this.info(job, `Attempt ${attempt}: produce...`, 50);
    await this.messageService.produce(job.data);
    await this.info(job, `Attempt ${attempt}: produced successfully`, 100);
  }
}
