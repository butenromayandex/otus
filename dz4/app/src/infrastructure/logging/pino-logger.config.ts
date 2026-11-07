import type { Request } from 'express'
import type { Params } from 'nestjs-pino'
import { createPinoLogger } from './create-pino-logger'

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress ?? req.ip ?? 'unknown'
}

export function buildPinoLoggerParams(): Params {
  const logger = createPinoLogger('http')

  return {
    pinoHttp: {
      logger,
      customLogLevel: () => 'info',
      customProps: (req) => ({
        ip: clientIp(req as Request),
      }),
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
      },
      customSuccessMessage: (req, res) =>
        `${req.method} ${req.url} ${clientIp(req as Request)} ${res.statusCode}`,
      customErrorMessage: (req, res) =>
        `${req.method} ${req.url} ${clientIp(req as Request)} ${res.statusCode}`,
    },
  }
}
