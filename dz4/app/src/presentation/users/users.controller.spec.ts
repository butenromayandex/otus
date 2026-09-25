import { Test, type TestingModule } from '@nestjs/testing'
import { CreateUserUseCase } from '../../application/user/create-user.use-case'
import { DeleteUserUseCase } from '../../application/user/delete-user.use-case'
import { GetUserUseCase } from '../../application/user/get-user.use-case'
import { GetUsersUseCase } from '../../application/user/get-users.use-case'
import { UpdateUserUseCase } from '../../application/user/update-user.use-case'
import { UserRepository } from '../../domain/user/user.repository'
import { UsersController } from './users.controller'

describe('UsersController', () => {
  let controller: UsersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        GetUsersUseCase,
        GetUserUseCase,
        CreateUserUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
