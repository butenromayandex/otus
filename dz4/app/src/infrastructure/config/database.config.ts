export type DatabaseEnv = {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export function getDatabaseEnv(): DatabaseEnv {
  const host = process.env.POSTGRES_HOST
  const username = process.env.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD
  const database = process.env.POSTGRES_DB

  if (!host || !username || !password || !database) {
    throw new Error(
      'Missing env: POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB',
    )
  }

  return {
    host,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username,
    password,
    database,
  }
}
