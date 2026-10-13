import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreateUserUseCase } from './application/user/create-user.use-case'
import { DeleteUserUseCase } from './application/user/delete-user.use-case'
import { GetStatsUseCase } from './application/user/get-stats.use-case'
import { GetUserUseCase } from './application/user/get-user.use-case'
import { GetUsersUseCase } from './application/user/get-users.use-case'
import { UpdateUserUseCase } from './application/user/update-user.use-case'
import { UserRepository } from './domain/user/user.repository'
import { UserOrmEntity } from './infrastructure/persistence/typeorm/user.orm-entity'
import { UserTypeormRepository } from './infrastructure/persistence/typeorm/user.typeorm-repository'
import { StatsController } from './presentation/stats/stats.controller'
import { UsersController } from './presentation/users/users.controller'

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController, StatsController],
  providers: [
    GetUsersUseCase,
    GetUserUseCase,
    GetStatsUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    { provide: UserRepository, useClass: UserTypeormRepository },
  ],
})
export class UsersModule {}

