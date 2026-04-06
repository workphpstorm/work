import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMakerProcessor } from './notification-maker.processor';
import { NotificationService } from '../../notification/notification.service';
import { MessagesService } from '../messages.service';
import { getQueueToken } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE_DLQ } from '../../notification/types/channel.types';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Job } from 'bullmq';
import { SendNotificationDto } from '../dto/queue.dto';

const createMockJob = (
  overrides: Partial<Job<SendNotificationDto>> = {},
): Job<SendNotificationDto> =>
  ({
    id: 'job-123',
    name: 'test-job',
    data: { channel: 'email', payload: { to: 'test@test.com' } },
    attemptsMade: 0,
    opts: { attempts: 3 },
    updateProgress: jest.fn().mockResolvedValue(undefined),
    log: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as unknown as Job<SendNotificationDto>;

describe('NotificationMakerProcessor', () => {
  let processor: NotificationMakerProcessor;
  let notificationService: jest.Mocked<NotificationService>;
  let dlqQueue: { add: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationMakerProcessor,
        {
          provide: getQueueToken(NOTIFICATION_QUEUE_DLQ),
          useValue: { add: jest.fn().mockResolvedValue({ id: 'dlq-job-1' }) },
        },
        {
          provide: MessagesService,
          useValue: {},
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: { send: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    processor = module.get(NotificationMakerProcessor);
    notificationService = module.get(NotificationService);
    dlqQueue = module.get(getQueueToken(NOTIFICATION_QUEUE_DLQ));
  });

  afterEach(() => jest.clearAllMocks());

  describe('process()', () => {
    it('має викликати notificationService.send з правильними аргументами', async () => {
      const job = createMockJob();

      await processor.process(job);

      expect(notificationService.send).toHaveBeenCalledWith('email', {
        to: 'test@test.com',
      });
    });

    it('має оновлювати прогрес джоби', async () => {
      const job = createMockJob({ attemptsMade: 1 });

      await processor.process(job);

      expect(job.updateProgress).toHaveBeenCalledWith(50);
      expect(job.updateProgress).toHaveBeenCalledWith(100);
    });

    it('має пробрасувати помилку якщо send() фейлиться', async () => {
      const job = createMockJob();
      notificationService.send.mockRejectedValue(new Error('SMTP failure'));

      await expect(processor.process(job)).rejects.toThrow('SMTP failure');
    });
  });

  describe('onFailed()', () => {
    const error = new Error('Connection timeout');
    error.stack = 'Error: Connection timeout\n  at ...';

    it('НЕ має пушити в DLQ якщо ще є спроби', async () => {
      const job = createMockJob({ attemptsMade: 1, opts: { attempts: 3 } });

      await processor.onFailed(job, error);

      expect(dlqQueue.add).not.toHaveBeenCalled();
    });

    it('має пушити в DLQ після останньої спроби', async () => {
      const job = createMockJob({ attemptsMade: 3, opts: { attempts: 3 } });

      await processor.onFailed(job, error);

      expect(dlqQueue.add).toHaveBeenCalledWith(
        'failed-task',
        expect.objectContaining({
          originalJobId: 'job-123',
          originalJobName: 'test-job',
          data: job.data,
          error: 'Connection timeout',
          stack: error.stack,
          attemptsMade: 3,
        }),
        { removeOnComplete: false, removeOnFail: false, attempts: 2 },
      );
    });

    it('має включати failedAt як валідний ISO рядок', async () => {
      const job = createMockJob({ attemptsMade: 3, opts: { attempts: 3 } });

      await processor.onFailed(job, error);

      const [, payload] = dlqQueue.add.mock.calls[0];
      expect(new Date(payload.failedAt).toISOString()).toBe(payload.failedAt);
    });
  });
});
