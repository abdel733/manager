import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Identifiants invalides');
    return { accessToken: await this.jwt.signAsync({ sub: user.id, role: user.role, email: user.email }), user: this.toPublicUser(user) };
  }

  private toPublicUser(user: { id: string; firstName: string; lastName: string; email: string; role: 'ADMIN' | 'MEMBER' }) {
    return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role };
  }
}
