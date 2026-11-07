import 'reflect-metadata'
import { createPinoLogger } from './infrastructure/logging/create-pino-logger'
import dataSource from './infrastructure/persistence/typeorm/data-source'

const logger = createPinoLogger('migrate-job')

async function migrate() {
  logger.info('Migration job started')

  await dataSource.initialize()
  const migrations = await dataSource.runMigrations()

  logger.info(
    { count: migrations.length, names: migrations.map((m) => m.name) },
    `Migration job finished: ran ${migrations.length} migration(s)`,
  )

  await dataSource.destroy()
}

migrate().catch((error) => {
  logger.error({ err: error }, 'Migration job failed')
  process.exit(1)
})
