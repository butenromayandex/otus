import { User } from '../../../domain/user/user'
import { UserOrmEntity } from './user.orm-entity'

export const UserMapper = {
  toDomain(row: UserOrmEntity): User {
    return new User(row.id, row.name, row.email, row.age)
  },

  toOrm(user: User): UserOrmEntity {
    const row = new UserOrmEntity()
    row.id = user.id
    row.name = user.name
    row.email = user.email
    row.age = user.age
    return row
  },
}
