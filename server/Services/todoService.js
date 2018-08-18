const todoDAO = require('../DAOs/todoDAO');
const NOT_FOUND = 'Resource not found';

const getAllTodo = async(req, res, next) => {
  try {
    const { user } = req;
    const todos = await todoDAO.findAllTodoByTenantId(user.id);
    res.status(200).send(todos);

  } catch (error) {
    next();
  }
};

const saveTodo = async(req, res, next) => {
  try {
    const { user, body } = req;
    const todoWithFk = {...body, tenantId: user.id}
    const todo = await todoDAO.createTodo(todoWithFk);
    res.status(200).send(todo);

  } catch (error) {
    next(error);
  }
};

const getTodo = async(req, res, next) => {
  try {
    const { params, user } = req
    const todo = await todoDAO.findTodoByIdAndTenantId(params.todoId, user.id)
   
    if(!todo) return res.status(404).send(NOT_FOUND);
    res.status(200).send(todo);

  } catch (error) {
    next(error);
  }
};

const updateTodo = async(req, res, next) => {
  try {
    const { params, body, user } = req;
    const responseBody = await todoDAO.updateTodoByIdAndTenantId(params.todoId, user.id, body);
    const todo = responseBody[1][0]; //postgres returning body
    if(!todo) return res.status(404).send(NOT_FOUND);
    res.status(200).send(todo);

  } catch (error) {
    next(error)
  }
};

const deleteTodo = async(req, res, next) => {
  try {
    const { params, user } = req;
    await todoDAO.destroyTodoByIdAndTenantId(params.todoId, user.id)
    res.status(200).send({id: params.todoId});

  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveTodo,
  getAllTodo,
  getTodo,
  updateTodo,
  deleteTodo
}