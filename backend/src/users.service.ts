import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({ where: { isActive: true }, select: { id: true, firstName: true, lastName: true, email: true, role: true, _count: { select: { assignments: true } } }, orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] });
  }

  async create(data: { firstName: string; lastName: string; email: string; password: string; role?: 'ADMIN' | 'MEMBER' }) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({ data: { firstName: data.firstName, lastName: data.lastName, email: data.email, passwordHash, role: data.role ?? 'MEMBER' }, select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true } });
  }

  update(id: string, data: { firstName?: string; lastName?: string; role?: 'ADMIN' | 'MEMBER'; isActive?: boolean }) {
    return this.prisma.user.update({ where: { id }, data, select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true } });
  }
}
