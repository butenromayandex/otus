import { Injectable } from '@nestjs/common'
import { User } from '../../domain/user/user'
import { UserRepository } from '../../domain/user/user.repository'

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
