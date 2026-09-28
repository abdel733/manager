var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from './prisma.service.js';
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async refreshOverdue() {
        await this.prisma.task.updateMany({
            where: { status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }, endDate: { lt: new Date() } },
            data: { status: TaskStatus.OVERDUE },
        });
    }
    async findAll(userId) {
        await this.refreshOverdue();
        return this.prisma.task.findMany({
            where: userId ? { assignments: { some: { userId } } } : undefined,
            include: { assignments: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } }, comments: { include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } } },
            orderBy: { endDate: 'asc' },
        });
    }
    async findOne(id) {
        await this.refreshOverdue();
        const task = await this.prisma.task.findUnique({ where: { id }, include: { assignments: { include: { user: true } }, comments: { include: { user: true }, orderBy: { createdAt: 'desc' } }, history: { orderBy: { createdAt: 'desc' }, include: { user: true } } } });
        if (!task)
            throw new NotFoundException('Tache introuvable');
        return task;
    }
    async create(data) {
        return this.prisma.task.create({ data: { title: data.title, description: data.description, startDate: new Date(data.startDate), endDate: new Date(data.endDate), creatorId: data.creatorId, assignments: { create: data.assigneeIds.map((userId) => ({ userId })) } }, include: { assignments: { include: { user: true } }, comments: { include: { user: true }, orderBy: { createdAt: 'desc' } } } });
    }
    async update(id, data) {
        await this.findOne(id);
        return this.prisma.$transaction(async (tx) => {
            if (data.assigneeIds) {
                await tx.taskAssignment.deleteMany({ where: { taskId: id } });
                await tx.taskAssignment.createMany({ data: data.assigneeIds.map((userId) => ({ taskId: id, userId })) });
            }
            return tx.task.update({ where: { id }, data: { title: data.title, description: data.description, startDate: data.startDate ? new Date(data.startDate) : undefined, endDate: data.endDate ? new Date(data.endDate) : undefined }, include: { assignments: { include: { user: true } }, comments: { include: { user: true }, orderBy: { createdAt: 'desc' } } } });
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.task.delete({ where: { id } });
    }
    async updateStatus(id, status, userId) {
        const task = await this.findOne(id);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.task.update({ where: { id }, data: { status, completedAt: status === TaskStatus.COMPLETED ? new Date() : null } });
            await tx.taskHistory.create({ data: { taskId: id, userId, action: 'STATUS_CHANGED', oldStatus: task.status, newStatus: status } });
            return updated;
        });
    }
    async addComment(taskId, userId, content) {
        await this.findOne(taskId);
        return this.prisma.comment.create({ data: { taskId, userId, content }, include: { user: true } });
    }
};
TasksService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.js.map