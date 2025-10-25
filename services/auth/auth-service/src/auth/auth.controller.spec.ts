import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dtos/auth.dto';
import { UserRole } from '../user/user.entity';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return an access token', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        location: '123 Main St, City, Country',
      };
      const accessToken = 'mockAccessToken';
      mockAuthService.register.mockResolvedValue({ access_token: accessToken });

      const result = await authController.register(registerDto);
      expect(result).toEqual({ access_token: accessToken });
      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.role,
      );
    });

    it('should throw BadRequestException if registration fails', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        location: '123 Main St, City, Country',
      };
      
      mockAuthService.register.mockRejectedValue(new BadRequestException('User with this email already exists'));

      await expect(authController.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should log in a user and return an access token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const accessToken = 'mockAccessToken';
      mockAuthService.login.mockResolvedValue({ access_token: accessToken });

      const result = await authController.login(loginDto);
      expect(result).toEqual({ access_token: accessToken });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('testAuth', () => {
    it('should return "Authenticated!" for a valid authenticated request', () => {
      // For guarded routes, the guard handles authentication before the controller method is called.
      // So, we just test that the method returns the expected value.
      expect(authController.testAuth()).toEqual('Authenticated!');
    });
  });
});
