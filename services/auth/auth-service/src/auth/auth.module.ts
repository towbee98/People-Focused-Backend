import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service'; // Import UserService
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module'; // Import RabbitMQModule
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { EmailModule } from '../email/email.module'; // Import EmailModule

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]), // Import User entity for TypeOrmModule
    RabbitMQModule, // Add RabbitMQModule to imports
    EmailModule, // Add EmailModule to imports
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy], // Add UserService and JwtStrategy to providers
  exports: [AuthService], // Export AuthService if it needs to be used by other modules
})
export class AuthModule {}
