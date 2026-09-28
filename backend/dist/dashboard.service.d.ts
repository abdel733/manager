import { PrismaService } from './prisma.service.js';
import { TasksService } from './tasks.service.js';
export declare class DashboardService {
    private readonly prisma;
    private readonly tasksService;
    constructor(prisma: PrismaService, tasksService: TasksService);
    getSummary(): Promise<{
        total: number;
        status: {
            [k: string]: number;
        };
        users: {
            id: string;
            name: string;
            counts: Record<string, number>;
        }[];
    }>;
}
