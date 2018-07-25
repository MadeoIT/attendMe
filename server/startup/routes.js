const todoController = require('../Controllers/todoController');
const tenantController = require('../Controllers/tenantController');
const authController = require('../Controllers/authController');

module.exports = (app) => {
  app.use('/api/auth', authController);
  app.use('/api/tenants', tenantController);
  app.use('/api/todos', todoController);
}