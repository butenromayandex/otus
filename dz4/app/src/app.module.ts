import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './infrastructure/persistence/typeorm/database.module'
import { HealthController } from './presentation/health/health.controller'
import { UsersModule } from './users.module'
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MetricsInterceptor } from './presentation/metrics/metrics.interceptor'
import { ChaosController } from './presentation/chaos/chaos.controller'
import { RunChaosUseCase } from './application/chaos/run-chaos.use-case'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true }, // CPU, memory, event loop
    }),
  ],
  controllers: [AppController, HealthController, ChaosController],
  providers: [
    AppService,
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
    RunChaosUseCase,
  ],
})
export class AppModule {}
