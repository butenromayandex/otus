import type { DataSourceOptions } from 'typeorm'
import { getDatabaseEnv } from '../../config/database.config'
import { CreateUsers1724500000000 } from './migrations/1724500000000-CreateUsers'
import { UserOrmEntity } from './user.orm-entity'

export function getTypeOrmOptions(): DataSourceOptions {
  const database = getDatabaseEnv()

  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [UserOrmEntity],
    migrations: [CreateUsers1724500000000],
    synchronize: false,
    migrationsRun: false,
  }
}
