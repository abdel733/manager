import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TasksService } from './tasks.service.js';

@Injectable()
export class OverdueScheduler {
  constructor(private readonly tasksService: TasksService) {}

  @Cron('*/5 * * * *')
  async markOverdueTasks() {
    await this.tasksService.refreshOverdue();
  }
}
