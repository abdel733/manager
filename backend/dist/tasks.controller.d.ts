import { TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service.js';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(userId?: string): Promise<({
        assignments: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            taskId: string;
            assignedAt: Date;
        })[];
        comments: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            taskId: string;
            content: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        startDate: Date;
        endDate: Date;
        creatorId: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        assignments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            userId: string;
            taskId: string;
            assignedAt: Date;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            taskId: string;
            content: string;
        })[];
        history: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            taskId: string;
            action: string;
            oldStatus: import("@prisma/client").$Enums.TaskStatus | null;
            newStatus: import("@prisma/client").$Enums.TaskStatus | null;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        startDate: Date;
        endDate: Date;
        creatorId: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: {
        title: string;
        description?: string;
        startDate: string;
        endDate: string;
        creatorId: string;
        assigneeIds: string[];
    }): Promise<{
        assignments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            userId: string;
            taskId: string;
            assignedAt: Date;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            taskId: string;
            content: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        startDate: Date;
        endDate: Date;
        creatorId: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, body: {
        status: TaskStatus;
        userId: string;
    }): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        startDate: Date;
        endDate: Date;
        creatorId: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, body: {
        title?: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        assigneeIds?: string[];
    }): Promise<{
        assignments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            userId: string;
            taskId: string;
            assignedAt: Date;
        })[];
        comments: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                email: string;
                passwordHash: string;
                role: import("@prisma/client").$Enums.Role;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            taskId: string;
            content: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        startDate: Date;
        endDate: Date;
        creatorId: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        startDate: Date;
        endDate: Date;
        creatorId: string;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addComment(id: string, body: {
        userId: string;
        content: string;
    }): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            email: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        taskId: string;
        content: string;
    }>;
}
