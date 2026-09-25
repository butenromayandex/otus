import { Injectable } from '@nestjs/common'
import { UserNotFoundError } from '../../domain/user/user.errors'
import { User } from '../../domain/user/user'
import { UserRepository } from '../../domain/user/user.repository'

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new UserNotFoundError(id)
    }
    return user
  }
}
