import pino, { type Logger } from 'pino'

/** JSON: INFO/WARN → stdout, ERROR → stderr */
export function createPinoLogger(name?: string): Logger {
  const level = process.env.LOG_LEVEL ?? 'info'
  const stream = pino.multistream(
    [
      { level: 'trace', stream: process.stdout },
      { level: 'error', stream: process.stderr },
    ],
    { dedupe: true },
  )

  return pino(
    {
      level,
      ...(name ? { name } : {}),
    },
    stream,
  )
}
