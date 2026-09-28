var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma.service.js';
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.user.findMany({ where: { isActive: true }, select: { id: true, firstName: true, lastName: true, email: true, role: true, _count: { select: { assignments: true } } }, orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }] });
    }
    async create(data) {
        const passwordHash = await bcrypt.hash(data.password, 12);
        return this.prisma.user.create({ data: { firstName: data.firstName, lastName: data.lastName, email: data.email, passwordHash, role: data.role ?? 'MEMBER' }, select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true } });
    }
    update(id, data) {
        return this.prisma.user.update({ where: { id }, data, select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true } });
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map