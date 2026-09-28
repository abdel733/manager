# Mosaïque

MVP de plateforme de gestion des tâches d'entreprise avec Next.js, NestJS et PostgreSQL.

## Structure

- `frontend`: interface Next.js avec tableau de bord administrateur
- `backend`: API NestJS, authentification JWT, Prisma et traitement automatique des tâches en retard

## Organisation par services

Le backend suit une séparation contrôleur, service et accès aux données:

- `TasksController` délègue les opérations à `TasksService`
- `AuthController` délègue la connexion à `AuthService`
- `UsersController` délègue la gestion des utilisateurs à `UsersService`
- `DashboardController` délègue les indicateurs à `DashboardService`
- `PrismaService` est le point d'accès unique à PostgreSQL
- `OverdueScheduler` déclenche `TasksService` pour les échéances

Le frontend centralise les appels HTTP dans `frontend/src/lib/api.ts`. Les composants ne construisent pas directement les URLs de l'API.

## Prérequis

- Node.js 20 ou supérieur
- PostgreSQL 15 ou supérieur

## Démarrage de PostgreSQL

```bash
docker compose up -d postgres
```

## Installation

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run start:dev
```

Les migrations versionnées dans `backend/prisma/migrations` recréent la structure
de la base. Le seed ajoute les utilisateurs et tâches de démonstration. Pour
reproduire des données métier réelles, il faut également restaurer une sauvegarde
PostgreSQL : les migrations ne contiennent pas les enregistrements existants.

Si une base locale existe déjà et a été créée avec `prisma db push`, sauvegardez-la
et vérifiez que son schéma correspond à la migration avant de la baseliner :

```bash
npx prisma migrate resolve --applied 20260928000000_init
```

Cette commande enregistre la migration comme déjà appliquée, sans recréer les
tables ni modifier les données existantes.

Dans un autre terminal:

```bash
cd frontend
npm install
npm run dev
```

L'interface est disponible sur `http://localhost:3000` et l'API sur `http://localhost:4000/api`.

## API MVP

- `POST /api/auth/login`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/status`
- `POST /api/tasks/:id/comments`
- `GET /api/dashboard/summary`

Le traitement planifié vérifie les tâches toutes les cinq minutes. Une tâche non terminée dont la date de fin est dépassée passe automatiquement à l'état `OVERDUE`.