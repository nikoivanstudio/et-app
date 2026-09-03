import {
  pbkdf2,
  randomBytes,
  scrypt,
  timingSafeEqual
} from 'node:crypto';

/**
 * Хеширование паролей (CRIT-4).
 *
 * Было: PBKDF2-HMAC-SHA512 с 1000 итераций — примерно в 210 раз дешевле
 * рекомендации OWASP, то есть перебор украденной базы обходился атакующему
 * дёшево. Плюс сравнение обычным `===`, зависящее по времени от совпадающего
 * префикса.
 *
 * Стало: scrypt (memory-hard, входит в node:crypto, не требует нативных
 * зависимостей) и сравнение через timingSafeEqual.
 *
 * Формат хранения — с явной пометкой алгоритма, чтобы старые записи можно было
 * проверять и незаметно для пользователя переводить на новый алгоритм:
 *
 *   scrypt$N=16384,r=8,p=1$<hex>   — актуальный
 *   <hex>                          — устаревший PBKDF2/1000 (без пометки)
 */

const SCRYPT_PREFIX = 'scrypt';

const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64
} as const;

const LEGACY_PBKDF2 = {
  iterations: 1000,
  keylen: 64,
  digest: 'sha512'
} as const;

export type PasswordHashResult = { hash: string; salt: string };

export type PasswordCompareResult = {
  /** Пароль верен. */
  matches: boolean;
  /** Хеш создан устаревшим алгоритмом и его следует пересчитать. */
  needsRehash: boolean;
};

const scryptAsync = (password: string, salt: string): Promise<Buffer> =>
  new Promise((resolve, reject) =>
    scrypt(
      password,
      salt,
      SCRYPT_PARAMS.keylen,
      {
        N: SCRYPT_PARAMS.N,
        r: SCRYPT_PARAMS.r,
        p: SCRYPT_PARAMS.p,
        // 128 * N * r = 16 МБ, с запасом к лимиту по умолчанию
        maxmem: 64 * 1024 * 1024
      },
      (error, value) => (error ? reject(error) : resolve(value))
    )
  );

const pbkdf2Async = (password: string, salt: string): Promise<Buffer> =>
  new Promise((resolve, reject) =>
    pbkdf2(
      password,
      salt,
      LEGACY_PBKDF2.iterations,
      LEGACY_PBKDF2.keylen,
      LEGACY_PBKDF2.digest,
      (error, value) => (error ? reject(error) : resolve(value))
    )
  );

const buildScryptHash = (digest: Buffer): string =>
  [
    SCRYPT_PREFIX,
    `N=${SCRYPT_PARAMS.N},r=${SCRYPT_PARAMS.r},p=${SCRYPT_PARAMS.p}`,
    digest.toString('hex')
  ].join('$');

const parseStoredHash = (
  stored: string
): { algorithm: 'scrypt' | 'pbkdf2-legacy'; digestHex: string } => {
  if (stored.startsWith(`${SCRYPT_PREFIX}$`)) {
    return { algorithm: 'scrypt', digestHex: stored.split('$').at(-1) || '' };
  }

  return { algorithm: 'pbkdf2-legacy', digestHex: stored };
};

/**
 * Сравнение, не зависящее по времени от позиции первого различия.
 * Буферы разной длины timingSafeEqual не принимает, поэтому длину проверяем
 * отдельно — она не является секретом.
 */
const safeEqualHex = (left: string, right: string): boolean => {
  if (left.length !== right.length || left.length === 0) {
    return false;
  }

  try {
    return timingSafeEqual(
      Buffer.from(left, 'hex'),
      Buffer.from(right, 'hex')
    );
  } catch {
    return false;
  }
};

async function hashPassword(
  password: string,
  salt = randomBytes(16).toString('hex')
): Promise<PasswordHashResult> {
  const digest = await scryptAsync(password, salt);

  return { hash: buildScryptHash(digest), salt };
}

async function comparePasswords({
  hash,
  password,
  salt
}: {
  password: string;
  hash: string;
  salt: string;
}): Promise<PasswordCompareResult> {
  const { algorithm, digestHex } = parseStoredHash(hash);

  if (algorithm === 'scrypt') {
    const digest = await scryptAsync(password, salt);

    return {
      matches: safeEqualHex(digest.toString('hex'), digestHex),
      needsRehash: false
    };
  }

  const legacyDigest = await pbkdf2Async(password, salt);
  const matches = safeEqualHex(legacyDigest.toString('hex'), digestHex);

  // Пересчитывать имеет смысл только когда пароль верен: только тогда
  // у нас на руках открытый пароль для нового хеша.
  return { matches, needsRehash: matches };
}

/**
 * Холостая проверка той же стоимости, что и настоящая.
 * Нужна, чтобы время ответа не выдавало существование логина (MED-9).
 */
async function dummyCompare(password: string): Promise<void> {
  await scryptAsync(password, 'dummy-salt-for-constant-time-response');
}

export const passwordService = {
  comparePasswords,
  hashPassword,
  dummyCompare
};
