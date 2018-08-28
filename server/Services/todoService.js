const todoDAO = require('../DAOs/todoDAO');
const NOT_FOUND = 'Resource not found';
const R = require('ramda');

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

/**
 * Update all the modified todos
 * @param {Array<Object>} body [{id: 1, ...properties, modified: true}, ...]
 * Create an array of todos to be updated (if they have been modified).
 * Create an array of DAO functions.
 * Execute the function in parallel and return the array 
 * of modified todos that have been saved in the database
 */
const updateTodoBatch = async(req, res, next) => {
  try {
    const { body, user } = req;
    const isTruthy = (todo) => todo.modified === true;

    const todosToUpdate = R.filter(
      isTruthy,
      body
    );

    const updateFunction = R.curry(
      (id, todo) => todoDAO.updateTodoByIdAndTenantId(todo.id, id, todo)
    );
    const arrayUpdateFunction = R.map(
      updateFunction(user.id), 
      todosToUpdate
    );
    
    const results = await Promise.all(arrayUpdateFunction);

    const updatedTodos = results.map(result => result[1][0]);
    res.status(200).send(updatedTodos);

  } catch (error) {
    next(error);
  }
}

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
  deleteTodo,
  updateTodoBatch
}