import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';

// Mock ObjectId from typeorm
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  ObjectId: jest.fn(() => ({
    toHexString: jest.fn(() => 'mockObjectId'),
  })),
}));

// Re-import ObjectId after mocking
import { ObjectId } from 'typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getAllUsers: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result: User[] = [
        { id: new ObjectId(), email: 'test1@example.com', password: 'hashedpassword1', role: UserRole.USER },
        { id: new ObjectId(), email: 'test2@example.com', password: 'hashedpassword2', role: UserRole.ADMIN },
      ];
      mockUserService.getAllUsers.mockResolvedValue(result);

      expect(await userController.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const userId = new ObjectId();
      const result: User = { id: userId, email: 'test1@example.com', password: 'hashedpassword1', role: UserRole.USER };
      mockUserService.findById.mockResolvedValue(result); // Changed to findById

      expect(await userController.findOne(userId.toHexString())).toEqual(result);
    });
  });
});
