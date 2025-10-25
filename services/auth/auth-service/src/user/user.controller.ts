import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ObjectId } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {

    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    async findAll() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'Return a single user.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async findOne(@Param('id') id: string) {
        return this.userService.findById(new ObjectId(id));
    }
}
