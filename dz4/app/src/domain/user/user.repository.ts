import { User } from './user'

export abstract class UserRepository {
  abstract findAll(): Promise<User[]>
  abstract findById(id: string): Promise<User | null>
  abstract save(user: User): Promise<User>
  abstract update(user: User): Promise<User>
  abstract delete(id: string): Promise<void>
}
