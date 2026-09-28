import { UsersService } from './users.service.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        _count: {
            assignments: number;
        };
    }[]>;
    create(body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: 'ADMIN' | 'MEMBER';
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    update(id: string, body: {
        firstName?: string;
        lastName?: string;
        role?: 'ADMIN' | 'MEMBER';
        isActive?: boolean;
    }): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
