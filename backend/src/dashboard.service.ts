import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { TasksService } from './tasks.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService, private readonly tasksService: TasksService) {}

  async getSummary() {
    await this.tasksService.refreshOverdue();
    const groups = await this.prisma.task.groupBy({ by: ['status'], _count: { _all: true } });
    const users = await this.prisma.user.findMany({ where: { isActive: true }, select: { id: true, firstName: true, lastName: true, assignments: { select: { task: { select: { status: true } } } } } });
    const status = Object.fromEntries(groups.map((group) => [group.status, group._count._all]));
    return { total: Object.values(status).reduce((sum, value) => sum + value, 0), status, users: users.map((user) => ({ id: user.id, name: `${user.firstName} ${user.lastName}`, counts: user.assignments.reduce<Record<string, number>>((counts, assignment) => { counts[assignment.task.status] = (counts[assignment.task.status] ?? 0) + 1; return counts; }, {}) })) };
  }
}
