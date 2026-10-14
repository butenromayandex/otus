import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { InvalidEmailError } from '../../domain/user/user.errors'
import { User } from '../../domain/user/user'
import { UserRepository } from '../../domain/user/user.repository'

export type CreateUserInput = {
  name: string
  email: string
  age: number
}

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const user = new User(randomUUID(), input.name, input.email, input.age)

    if (!user.isValidEmail()) {
      throw new InvalidEmailError(input.email)
    }

    return await this.userRepository.save(user)
  }
}
