import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import type { Request, Response } from 'express'
import type { Counter, Histogram } from 'prom-client'
import { Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly requestsTotal: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private readonly requestDuration: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle()
    }

    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()

    const path = req.route?.path ?? req.path
    const method = req.method

    if (
      path === '/metrics' ||
      path === '/healthz' ||
      path === '/stats' ||
      path === '/'
    ) {
      return next.handle()
    }

    const endTimer = this.requestDuration.startTimer()

    res.on('finish', () => {
      const status = String(res.statusCode)
      const labels = { method, path, status }
      this.requestsTotal.inc(labels)
      endTimer(labels)
    })

    return next.handle()
  }
}
