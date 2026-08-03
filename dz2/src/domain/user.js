class User {
    constructor(id, name, email) {
      this.id = id;
      this.name = name;
      this.email = email;
    }
  
    // Бизнес-логика: проверка валидности email
    isValidEmail() {
      return this.email && this.email.includes('@');
    }
  }