import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RunChaosUseCase } from './application/chaos/run-chaos.use-case'
import { AppLifecycleService } from './infrastructure/logging/app-lifecycle.service'
import { buildPinoLoggerParams } from './infrastructure/logging/pino-logger.config'
import { DatabaseModule } from './infrastructure/persistence/typeorm/database.module'
import { ChaosController } from './presentation/chaos/chaos.controller'
import { AllExceptionsFilter } from './presentation/filters/all-exceptions.filter'
import { HealthController } from './presentation/health/health.controller'
import { MetricsInterceptor } from './presentation/metrics/metrics.interceptor'
import { UsersModule } from './users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(buildPinoLoggerParams()),
    DatabaseModule,
    UsersModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  controllers: [AppController, HealthController, ChaosController],
  providers: [
    AppService,
    AppLifecycleService,
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    RunChaosUseCase,
  ],
})
export class AppModule {}
