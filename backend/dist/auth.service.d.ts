import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: "ADMIN" | "MEMBER";
        };
    }>;
    private toPublicUser;
}
