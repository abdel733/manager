import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({ where: { email: 'admin@acme.test' }, update: { firstName: 'Julie', lastName: 'Dupont', passwordHash, role: Role.ADMIN, isActive: true }, create: { firstName: 'Julie', lastName: 'Dupont', email: 'admin@acme.test', passwordHash, role: Role.ADMIN } });
  const members = await Promise.all([
    ['Sophie', 'Martin', 'sophie@acme.test'],
    ['Thomas', 'Bernard', 'thomas@acme.test'],
    ['Nina', 'Moreau', 'nina@acme.test'],
    ['Lucas', 'Petit', 'lucas@acme.test'],
  ].map(async ([firstName, lastName, email]) => prisma.user.upsert({ where: { email }, update: { firstName, lastName, passwordHash, role: Role.MEMBER, isActive: true }, create: { firstName, lastName, email, passwordHash, role: Role.MEMBER } })));
  const count = await prisma.task.count();
  if (count === 0) {
    await prisma.task.create({ data: { title: 'Préparer le rapport trimestriel', description: 'Rassembler les données et préparer la synthèse.', startDate: new Date('2026-09-25'), endDate: new Date('2026-09-30'), creatorId: admin.id, status: TaskStatus.IN_PROGRESS, assignments: { create: [{ userId: members[0].id }] } } });
    await prisma.task.create({ data: { title: 'Mettre à jour la page tarifs', description: 'Valider les nouveaux tarifs avec le service commercial.', startDate: new Date('2026-09-25'), endDate: new Date('2026-10-04'), creatorId: admin.id, assignments: { create: [{ userId: members[1].id }] } } });
    await prisma.task.create({ data: { title: 'Corriger le parcours de paiement', description: 'Identifier et corriger le blocage du parcours de paiement.', startDate: new Date('2026-09-18'), endDate: new Date('2026-09-22'), creatorId: admin.id, status: TaskStatus.OVERDUE, assignments: { create: [{ userId: members[2].id }] } } });
  }
}

main().finally(() => prisma.$disconnect());
