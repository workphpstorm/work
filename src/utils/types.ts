import { SendNotificationDto } from '../queue/dto/queue.dto';

export class ErrorLogJobDto {
  originalJobId: string | undefined;
  originalJobName: string;
  data: SendNotificationDto;
  error: string;
  stack: string | undefined;
  attemptsMade: number;
  failedAt: string;
}
