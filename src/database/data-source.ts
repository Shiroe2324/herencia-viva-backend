import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_REJECT_UNAUTHORIZED,
  DATABASE_SSL_CA,
  DATABASE_USERNAME,
  IS_DEVELOPMENT,
} from '@/configs';
import { resolvePath } from '@/utils';

export const dataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: IS_DEVELOPMENT,
  namingStrategy: new SnakeNamingStrategy(),
  ssl: DATABASE_REJECT_UNAUTHORIZED ? { rejectUnauthorized: true, ca: DATABASE_SSL_CA } : false,
  entities: [resolvePath('database/entities/*.entity.{ts,js}')],
  migrations: [resolvePath('database/migrations/*.{ts,js}')],
  subscribers: [resolvePath('database/subscribers/*.{ts,js}')],
});
