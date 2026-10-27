import { Injectable } from '@nestjs/common'
import { UserNotFoundError } from '../../domain/user/user.errors'
import { UserRepository } from '../../domain/user/user.repository'

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new UserNotFoundError(id)
    }

    await this.userRepository.delete(id)
  }
}
