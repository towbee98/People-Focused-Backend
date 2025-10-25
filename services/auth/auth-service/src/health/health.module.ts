import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        synchronize: true, // In production, this should be false
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HealthController],
  providers: [RabbitMQService], // Provide RabbitMQService for health check
})
export class HealthModule {}
