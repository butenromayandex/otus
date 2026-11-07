import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { createPinoLogger } from './infrastructure/logging/create-pino-logger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))
  app.enableShutdownHooks()

  const port = process.env.PORT ?? 3000
  await app.listen(port)
}

bootstrap().catch((error: unknown) => {
  createPinoLogger('app').error({ err: error }, 'Application failed to start')
  process.exit(1)
})
