import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common'
import { RunChaosUseCase } from '../../application/chaos/run-chaos.use-case'
import { SimulatedFailureError } from '../../domain/chaos/chaos.errors'

@Controller('chaos')
export class ChaosController {
  constructor(private readonly runChaosUseCase: RunChaosUseCase) {}

  @Get()
  async chaos(@Query('delayMs') delayMs = '0', @Query('fail') fail = 'false') {
    try {
      return await this.runChaosUseCase.execute({
        delayMs: Number(delayMs) || 0,
        fail: fail === 'true' || fail === '1',
      })
    } catch (error) {
      if (error instanceof SimulatedFailureError) {
        throw new InternalServerErrorException(error.message)
      }
      throw error
    }
  }
}
