const db = require('../models');

module.exports = {
  findAllTodo: () => db.Todo.findAll(),
  findAllTodoByTenantId: (tenantId) => db.Todo.findAll({where: {tenantId}}),
  findTodoById: (todoId) => db.Todo.find({where: { id: todoId}}),
  createTodo: (todoObj) => db.Todo.create(todoObj),
  updateTodoById: (todoId, todoObj) => db.Todo.update(todoObj, {where: {id: todoId}, returning: true}),
  destroyTodoById: (todoId) => db.Todo.destroy({where: {id: todoId}})
}