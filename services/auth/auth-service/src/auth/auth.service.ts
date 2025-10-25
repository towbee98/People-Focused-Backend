import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/user.entity';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'; // Import RabbitMQService
import { EmailService } from '../email/email.service'; // Import EmailService
import { ObjectId } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private rabbitmqService: RabbitMQService, // Inject RabbitMQService
    private emailService: EmailService, // Inject EmailService
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  }

  async register(
    email: string,
    password: string,
    role: UserRole,
    fullName?: string,
    phoneNumber?: string,
    location?: string,
  ): Promise<any> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const otp = this.generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const user = await this.userService.createUser(
      email,
      password,
      role,
      otp,
      otpExpires,
      fullName,
      phoneNumber,
      location,
    );

    // Send OTP email
   // await this.emailService.sendOtpEmail(user.email, otp);

    // Publish UserRegistered message
    await this.rabbitmqService.publish('user_registered_queue', {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date(),
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token valid for 7 days

    user.refreshToken = refreshToken;
    await this.userService.updateUser(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id, role: user.role });
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: ObjectId): Promise<void> {
    const user = await this.userService.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await this.userService.updateUser(user);
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.otp !== otp) {
      return false;
    }
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return false;
    }
    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await this.userService.updateUser(user);
    return true;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Generate a random token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await this.userService.updateUser(user);

    // Send reset password email
    await this.emailService.sendResetPasswordEmail(user.email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userService.findByResetPasswordToken(token);
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset password token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await this.userService.updateUser(user);
  }
}
