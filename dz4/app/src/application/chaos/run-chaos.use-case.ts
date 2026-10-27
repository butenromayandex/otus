import { Injectable } from '@nestjs/common'
import { SimulatedFailureError } from '../../domain/chaos/chaos.errors'

export type RunChaosInput = {
  delayMs: number
  fail: boolean
}

@Injectable()
export class RunChaosUseCase {
  async execute(input: RunChaosInput): Promise<{ ok: true }> {
    const delayMs = Math.min(Math.max(input.delayMs, 0), 5000)

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    if (input.fail) {
      throw new SimulatedFailureError()
    }

    return { ok: true }
  }
}
