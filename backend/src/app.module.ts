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

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), JwtModule.register({ global: true, secret: process.env.JWT_SECRET ?? 'development-secret' })],
  controllers: [AuthController, TasksController, DashboardController, UsersController],
  providers: [PrismaService, TasksService, OverdueScheduler, AuthService, DashboardService, UsersService],
})
export class AppModule {}
