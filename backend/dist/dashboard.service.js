var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { TasksService } from './tasks.service.js';
let DashboardService = class DashboardService {
    prisma;
    tasksService;
    constructor(prisma, tasksService) {
        this.prisma = prisma;
        this.tasksService = tasksService;
    }
    async getSummary() {
        await this.tasksService.refreshOverdue();
        const groups = await this.prisma.task.groupBy({ by: ['status'], _count: { _all: true } });
        const users = await this.prisma.user.findMany({ where: { isActive: true }, select: { id: true, firstName: true, lastName: true, assignments: { select: { task: { select: { status: true } } } } } });
        const status = Object.fromEntries(groups.map((group) => [group.status, group._count._all]));
        return { total: Object.values(status).reduce((sum, value) => sum + value, 0), status, users: users.map((user) => ({ id: user.id, name: `${user.firstName} ${user.lastName}`, counts: user.assignments.reduce((counts, assignment) => { counts[assignment.task.status] = (counts[assignment.task.status] ?? 0) + 1; return counts; }, {}) })) };
    }
};
DashboardService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, TasksService])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map