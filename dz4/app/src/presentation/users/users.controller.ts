import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { CreateUserUseCase } from '../../application/user/create-user.use-case'
import { DeleteUserUseCase } from '../../application/user/delete-user.use-case'
import { GetUserUseCase } from '../../application/user/get-user.use-case'
import { GetUsersUseCase } from '../../application/user/get-users.use-case'
import { UpdateUserUseCase } from '../../application/user/update-user.use-case'
import {
  EmailAlreadyExistsError,
  InvalidEmailError,
  UserNotFoundError,
} from '../../domain/user/user.errors'
import { User } from '../../domain/user/user'

type UserBody = {
  name: string
  email: string
  age: number
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.getUsersUseCase.execute()
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.mapErrors(() => this.getUserUseCase.execute(id))
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: UserBody): Promise<User> {
    return await this.mapErrors(() => this.createUserUseCase.execute(body))
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UserBody,
  ): Promise<User> {
    return await this.mapErrors(() =>
      this.updateUserUseCase.execute({ id, ...body }),
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.mapErrors(() => this.deleteUserUseCase.execute(id))
  }

  private async mapErrors<T>(action: () => Promise<T>): Promise<T> {
    try {
      return await action()
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        throw new BadRequestException(error.message)
      }
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException(error.message)
      }
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message)
      }
      throw error
    }
  }
}
