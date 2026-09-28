import { TasksService } from './tasks.service.js';
export declare class OverdueScheduler {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    markOverdueTasks(): Promise<void>;
}
