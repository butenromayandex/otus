import { Controller, Get } from '@nestjs/common'
import {
  GetStatsUseCase,
  type StatsResult,
} from '../../application/user/get-stats.use-case'

@Controller('stats')
export class StatsController {
  constructor(private readonly getStatsUseCase: GetStatsUseCase) {}

  @Get()
  getStats(): Promise<StatsResult> {
    return this.getStatsUseCase.execute()
  }
}
