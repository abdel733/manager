// @ts-expect-error NestJS dependencies are resolved at runtime in the backend environment.
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() body: { firstName: string; lastName: string; email: string; password: string; role?: 'ADMIN' | 'MEMBER' }) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { firstName?: string; lastName?: string; role?: 'ADMIN' | 'MEMBER'; isActive?: boolean }) {
    return this.usersService.update(id, body);
  }
}
