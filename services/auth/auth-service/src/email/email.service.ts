import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Your OTP for registration',
      html: `
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) for registration is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'Password Reset Request',
      html: `
        <p>Dear User,</p>
        <p>You have requested to reset your password.</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}">Reset Password</a></p>
        <p>This link is valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
