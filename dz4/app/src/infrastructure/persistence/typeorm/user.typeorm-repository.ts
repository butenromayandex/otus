import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryFailedError, Repository } from 'typeorm'
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from '../../../domain/user/user.errors'
import { User } from '../../../domain/user/user'
import { UserRepository } from '../../../domain/user/user.repository'
import { UserMapper } from './user.mapper'
import { UserOrmEntity } from './user.orm-entity'

@Injectable()
export class UserTypeormRepository extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {
    super()
  }

  async findAll(): Promise<User[]> {
    const rows = await this.repository.find()
    return rows.map((row) => UserMapper.toDomain(row))
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repository.findOneBy({ id })
    return row ? UserMapper.toDomain(row) : null
  }

  async save(user: User): Promise<User> {
    try {
      const saved = await this.repository.save(UserMapper.toOrm(user))
      return UserMapper.toDomain(saved)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as Error & { code?: string }
        if (driverError.code === '23505') {
          throw new EmailAlreadyExistsError(user.email)
        }
      }
      throw error
    }
  }

  async update(user: User): Promise<User> {
    try {
      await this.repository.update(user.id, {
        name: user.name,
        email: user.email,
        age: user.age,
      })
      const row = await this.repository.findOneBy({ id: user.id })
      if (!row) {
        throw new UserNotFoundError(user.id)
      }
      return UserMapper.toDomain(row)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as Error & { code?: string }
        if (driverError.code === '23505') {
          throw new EmailAlreadyExistsError(user.email)
        }
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
