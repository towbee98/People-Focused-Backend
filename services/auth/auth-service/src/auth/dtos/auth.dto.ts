import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'USER', enum: UserRole })
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '123 Main St, City, Country' })
  @IsString()
  location: string;
}

export class LoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}


export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
