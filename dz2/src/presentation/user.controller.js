class UserController {
    constructor(createUserUseCase) {
      this.createUserUseCase = createUserUseCase;
    }
  
    async createUser(req, res) {
      try {
        const { name, email } = req.body;
        
        // Передаем в Use Case только чистые данные
        const result = await this.createUserUseCase.execute(name, email);
        
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  
  module.exports = UserController;