export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email format: ${email}`)
    this.name = 'InvalidEmailError'
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`)
    this.name = 'EmailAlreadyExistsError'
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`)
    this.name = 'UserNotFoundError'
  }
}
