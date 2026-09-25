import { Injectable } from '@nestjs/common'
import {
  InvalidEmailError,
  UserNotFoundError,
} from '../../domain/user/user.errors'
import { User } from '../../domain/user/user'
import { UserRepository } from '../../domain/user/user.repository'

export type UpdateUserInput = {
  id: string
  name: string
  email: string
  age: number
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.id)
    if (!user) {
      throw new UserNotFoundError(input.id)
    }

    user.name = input.name
    user.email = input.email
    user.age = input.age

    if (!user.isValidEmail()) {
      throw new InvalidEmailError(input.email)
    }

    return await this.userRepository.update(user)
  }
}
