const db = require('../models');

module.exports = {
  findAllTodoByTenantId: (tenantId) => db.Todo.findAll({
    where: {
      tenantId
    }
  }),

  findTodoByIdAndTenantId: (todoId, tenantId) => db.Todo.find({
    where: {
      id: todoId,
      tenantId
    }
  }),
  createTodo: (todoObj) => db.Todo.create(todoObj),

  updateTodoByIdAndTenantId: (todoId, tenantId, todoObj) => db.Todo.update(todoObj, {
    where: {
      id: todoId,
      tenantId
    },
    returning: true
  }), 
  
  destroyTodoByIdAndTenantId: (todoId, tenantId) => db.Todo.destroy({
    where: {
      id: todoId,
      tenantId
    }
  })
}