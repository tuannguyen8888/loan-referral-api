import { Test, TestingModule } from '@nestjs/testing';
import { McNotificationService } from './mc-notification.service';

describe('McNotificationService', () => {
  let service: McNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McNotificationService],
    }).compile();

    service = module.get<McNotificationService>(McNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
