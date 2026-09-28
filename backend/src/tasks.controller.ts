import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: { title: string; description?: string; startDate: string; endDate: string; creatorId: string; assigneeIds: string[] }) {
    return this.tasksService.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: TaskStatus; userId: string }) {
    return this.tasksService.updateStatus(id, body.status, body.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { title?: string; description?: string; startDate?: string; endDate?: string; assigneeIds?: string[] }) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() body: { userId: string; content: string }) {
    return this.tasksService.addComment(id, body.userId, body.content);
  }
}
