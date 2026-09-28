import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async refreshOverdue() {
    await this.prisma.task.updateMany({
      where: { status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }, endDate: { lt: new Date() } },
      data: { status: TaskStatus.OVERDUE },
    });
  }

  async findAll(userId?: string) {
    await this.refreshOverdue();
    return this.prisma.task.findMany({
      where: userId ? { assignments: { some: { userId } } } : undefined,
      include: { assignments: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } }, comments: { include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } } },
      orderBy: { endDate: 'asc' },
    });
  }

  async findOne(id: string) {
    await this.refreshOverdue();
    const task = await this.prisma.task.findUnique({ where: { id }, include: { assignments: { include: { user: true } }, comments: { include: { user: true }, orderBy: { createdAt: 'desc' } }, history: { orderBy: { createdAt: 'desc' }, include: { user: true } } } });
    if (!task) throw new NotFoundException('Tache introuvable');
    return task;
  }

  async create(data: { title: string; description?: string; startDate: string; endDate: string; creatorId: string; assigneeIds: string[] }) {
    return this.prisma.task.create({ data: { title: data.title, description: data.description, startDate: new Date(data.startDate), endDate: new Date(data.endDate), creatorId: data.creatorId, assignments: { create: data.assigneeIds.map((userId) => ({ userId })) } }, include: { assignments: { include: { user: true } }, comments: { include: { user: true }, orderBy: { createdAt: 'desc' } } } });
  }

  async update(id: string, data: { title?: string; description?: string; startDate?: string; endDate?: string; assigneeIds?: string[] }) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      if (data.assigneeIds) {
        await tx.taskAssignment.deleteMany({ where: { taskId: id } });
        await tx.taskAssignment.createMany({ data: data.assigneeIds.map((userId) => ({ taskId: id, userId })) });
      }
      return tx.task.update({ where: { id }, data: { title: data.title, description: data.description, startDate: data.startDate ? new Date(data.startDate) : undefined, endDate: data.endDate ? new Date(data.endDate) : undefined }, include: { assignments: { include: { user: true } }, comments: { include: { user: true }, orderBy: { createdAt: 'desc' } } } });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }

  async updateStatus(id: string, status: TaskStatus, userId: string) {
    const task = await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.task.update({ where: { id }, data: { status, completedAt: status === TaskStatus.COMPLETED ? new Date() : null } });
      await tx.taskHistory.create({ data: { taskId: id, userId, action: 'STATUS_CHANGED', oldStatus: task.status, newStatus: status } });
      return updated;
    });
  }

  async addComment(taskId: string, userId: string, content: string) {
    await this.findOne(taskId);
    return this.prisma.comment.create({ data: { taskId, userId, content }, include: { user: true } });
  }
}
