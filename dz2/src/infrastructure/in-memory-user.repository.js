class InMemoryUserRepository {
    constructor() {
      this.users = [];
      this.currentId = 1;
    }
  
    async save(user) {
      user.id = this.currentId++;
      this.users.push(user);
      return user;
    }
  }
  
  module.exports = InMemoryUserRepository;