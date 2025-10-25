import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyOtpDto, ResetPasswordDto, RefreshTokenDto, LogoutDto, ForgotPasswordDto } from './dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ObjectId } from 'typeorm';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'Register a new user' , })
  @ApiResponse({ status: 201, description: 'User successfully registered and OTP sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() registerDto: RegisterDto) {
    
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role,
      registerDto.fullName,
      registerDto.phoneNumber,
      registerDto.location,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for user registration' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or OTP expired.' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const isVerified = await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    if (!isVerified) {
      throw new BadRequestException('Invalid OTP or OTP expired');
    }
    return { message: 'OTP verified successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent if user exists.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'If a user with that email exists, a password reset email has been sent.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password using a token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token, or bad request.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password has been reset successfully.' };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and revoke refresh token' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  async logout(@Body() logoutDto: LogoutDto) {
    await this.authService.logout(new ObjectId(logoutDto.userId));
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test authenticated access' })
  @ApiResponse({ status: 200, description: 'Authenticated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('test-auth')
  testAuth() {
    return 'Authenticated!';
  }
}
