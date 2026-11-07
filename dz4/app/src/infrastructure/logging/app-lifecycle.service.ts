import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common'
import { Logger } from 'nestjs-pino'

@Injectable()
export class AppLifecycleService
  implements OnApplicationBootstrap, BeforeApplicationShutdown
{
  constructor(private readonly logger: Logger) {}

  onApplicationBootstrap() {
    this.logger.log('Application started')
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.log(
      signal
        ? `Application stopping (signal=${signal})`
        : 'Application stopping',
    )
  }
}
