import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema'; // Import validationSchema
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // Import ThrottlerModule and ThrottlerGuard
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD
import { LoggerModule } from './common/logger/logger.module'; // Import LoggerModule
import { LoggerService } from './common/logger/logger.service'; // Import LoggerService
import { HealthModule } from './health/health.module'; // Import HealthModule


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      validationSchema, // Add validation schema
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests
    }]),
    TypeOrmModule.forRoot({
    type: 'mongodb',
    url: process.env.MONGODB_URI,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // autoLoadEntities: true,
     synchronize: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],


  }), UserModule, AuthModule, LoggerModule, HealthModule], // Add LoggerModule and HealthModule to imports
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    LoggerService, // Provide LoggerService
  ],
})
export class AppModule {}
