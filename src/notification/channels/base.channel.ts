import { INotificationChannel } from '../interfaces/notification-channel.interface';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLogEntity } from '../entities/error.log';

export abstract class BaseChannel implements INotificationChannel {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: Logger,
    @InjectRepository(ErrorLogEntity)
    protected readonly repo: Repository<ErrorLogEntity>,
  ) {}
  randomException() {
    const rand = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const randomIndex = Math.floor(Math.random() * rand.length);
    const randomElement = rand[randomIndex];
    if (randomElement < 5) {
      throw new Error(
        'Something wrong with sending message. Please try again.',
      );
    }
  }
  abstract send(payload: any): Promise<void>;
}
