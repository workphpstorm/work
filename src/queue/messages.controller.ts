import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PRODUCER_QUEUE } from '../notification/types/channel.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('api')
export class MessagesController {
  constructor(
    @InjectQueue(PRODUCER_QUEUE) private readonly queue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post('produce')
  async send(@Body() dto: any) {
    return await this.queue.add('produce', dto, {
      removeOnComplete: false,
      removeOnFail: false,
      attempts: 2,
    });
  }
}
