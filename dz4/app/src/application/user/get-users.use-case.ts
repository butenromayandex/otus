import { Injectable } from '@nestjs/common'
import type { User } from '../../domain/user/user'
import type { UserRepository } from '../../domain/user/user.repository'

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
