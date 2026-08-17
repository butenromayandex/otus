const User = require('../domain/user');

class CreateUserUseCase {
  // Инверсия зависимостей: репозиторий приходит снаружи
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(name, email) {
    const user = new User(null, name, email);

    if (!user.isValidEmail()) {
      throw new Error('Invalid email format');
    }

    return await this.userRepository.save(user);
  }
}

module.exports = CreateUserUseCase;