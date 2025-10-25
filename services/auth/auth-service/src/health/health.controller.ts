import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private rabbitmqService: RabbitMQService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      async () => this.rabbitmqService.checkHealth(), // Assuming checkHealth method exists in RabbitMQService
    ]);
  }
}
