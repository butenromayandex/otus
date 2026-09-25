import 'reflect-metadata'
import dataSource from './infrastructure/persistence/typeorm/data-source'

async function migrate() {
  await dataSource.initialize()
  const migrations = await dataSource.runMigrations()
  console.log(`Ran ${migrations.length} migration(s)`)
  await dataSource.destroy()
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
