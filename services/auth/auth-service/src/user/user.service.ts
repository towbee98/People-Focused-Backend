import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService {

     constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser(
        email: string,
        password: string,
        role: UserRole,
        otp?: string,
        otpExpires?: Date,
        fullName?: string,
        phoneNumber?: string,
        location?: string,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires,
            fullName,
            phoneNumber,
            location,
        });
        return this.userRepository.save(newUser);
    }

    async updateUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: ObjectId): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async updateUserRoles(id: ObjectId, role: UserRole): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        user.role = role;
        return this.userRepository.save(user);
    }   

    async findByResetPasswordToken(token: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { resetPasswordToken: token } });
    }
}
