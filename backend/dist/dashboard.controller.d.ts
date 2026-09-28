import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    summary(): Promise<{
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
