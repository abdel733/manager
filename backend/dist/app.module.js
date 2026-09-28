var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './auth.controller.js';
import { DashboardController } from './dashboard.controller.js';
import { PrismaService } from './prisma.service.js';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { OverdueScheduler } from './overdue.scheduler.js';
import { UsersController } from './users.controller.js';
import { AuthService } from './auth.service.js';
import { DashboardService } from './dashboard.service.js';
import { UsersService } from './users.service.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), JwtModule.register({ global: true, secret: process.env.JWT_SECRET ?? 'development-secret' })],
        controllers: [AuthController, TasksController, DashboardController, UsersController],
        providers: [PrismaService, TasksService, OverdueScheduler, AuthService, DashboardService, UsersService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map