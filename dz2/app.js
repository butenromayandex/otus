const express = require('express');
const InMemoryUserRepository = require('./src/infrastructure/in-memory-user.repository');
const CreateUserUseCase = require('./src/application/create-user.use-case');
const UserController = require('./src/presentation/user.controller');
const HealthController = require('./src/presentation/health.controller');

const app = express();
app.use(express.json());

const userRepository = new InMemoryUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userController = new UserController(createUserUseCase);
const healthController = new HealthController();

app.post('/users', (req, res) => userController.createUser(req, res));
app.get('/health', (req, res) => healthController.getHealth(req, res));

module.exports = app;