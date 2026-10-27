import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../domain/user/user.repository'

export type StatsResult = {
  usersCount: number
}

@Injectable()
export class GetStatsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<StatsResult> {
    const users = await this.userRepository.findAll()
    return { usersCount: users.length }
  }
}
