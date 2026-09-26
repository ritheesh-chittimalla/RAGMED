import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => {
  const dbType = (config.get<string>('DB_TYPE') || 'mysql').toLowerCase();

  if (dbType === 'mysql' || dbType === 'mariadb') {
    return {
      type: 'mysql',
      host: config.get<string>('DB_HOST') || 'localhost',
      port: Number(config.get<number>('DB_PORT')) || 3306,
      username: config.get<string>('DB_USER') || 'root',
      password: config.get<string>('DB_PASSWORD') || 'root',
      database: config.get<string>('DB_NAME') || 'mediqon',
      entities: [__dirname + '/../modules/**/*.entity.{ts,js}'],
      synchronize: true, // DEV ONLY
    };
  }

  return {
    type: 'postgres',
    host: config.get<string>('DB_HOST') || 'localhost',
    port: Number(config.get<number>('DB_PORT')) || 5432,
    username: config.get<string>('DB_USER') || 'postgres',
    password: config.get<string>('DB_PASSWORD') || 'postgres',
    database: config.get<string>('DB_NAME') || 'mediqon',
    entities: [__dirname + '/../modules/**/*.entity.{ts,js}'],
    synchronize: true, // DEV ONLY
  };
};
