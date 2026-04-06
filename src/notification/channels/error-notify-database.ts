import { Injectable } from '@nestjs/common';
import { BaseChannel } from './base.channel';
import { ErrorLogJobDto } from '../../utils/types';

@Injectable()
export class ErrorNotifyDatabase extends BaseChannel {
  async send(payload: ErrorLogJobDto): Promise<any> {
    this.logger.info(`Save error to database`);
    const log = this.repo.create(payload);
    await this.repo.save(log);
    return Promise.resolve();
  }
}
