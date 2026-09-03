import 'dotenv/config';

import { Role } from '@/entities/user/domain';
import { passwordService } from '@/entities/user/services/password';

import { dbClient } from '@/shared/lib/db';

import { seedPosts } from './seed-posts';

type SeedUser = {
  login: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

// Тестовые аккаунты для локальной разработки. Пароль у всех одинаковый — 12345678.
const seedUsers: SeedUser[] = [
  {
    login: 'user',
    password: '12345678',
    role: Role.USER,
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 999 123-45-67'
  },
  { login: 'superadmin', password: '12345678', role: Role.SUPER_ADMIN }
];

async function main() {
  let authorId: number | null = null;

  for (const { login, password, role, ...profile } of seedUsers) {
    const { hash, salt } = await passwordService.hashPassword(password);

    const user = await dbClient.user.upsert({
      where: { login },
      update: { passwordHash: hash, salt, role, ...profile },
      create: { login, passwordHash: hash, salt, role, ...profile }
    });

    if (role === Role.SUPER_ADMIN) {
      authorId = user.id;
    }

    console.log(`✓ user "${user.login}" (role=${user.role})`);
  }

  if (authorId === null) {
    throw new Error('Не найден автор для постов');
  }

  await seedPosts(authorId);
}

main()
  .then(async () => {
    await dbClient.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await dbClient.$disconnect();
    process.exit(1);
  });
