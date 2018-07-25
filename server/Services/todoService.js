const todoDAO = require('../DAOs/todoDAO');
const NOT_FOUND = 'Resource not found';

const getAllTodo = async(req, res, next) => {
  try {
    const todos = await todoDAO.findAllTodo();
    res.status(200).send(todos);

  } catch (error) {
    next();
  }
};

const saveTodo = async(req, res, next) => {
  try {
    const todo = await todoDAO.createTodo(req.body);
    res.status(200).send(todo);

  } catch (error) {
    next(error);
  }
};

const getTodo = async(req, res, next) => {
  try {
    const todo = await todoDAO.findTodoById(req.params.todoId);
   
    if(!todo) return res.status(404).send(NOT_FOUND);
    res.status(200).send(todo);

  } catch (error) {
    next(error);
  }
};

const updateTodo = async(req, res, next) => {
  try {
    const { params, body } = req;
    const responseBody = await todoDAO.updateTodoById(params.todoId, body);
    const todo = responseBody[1][0]; //postgres returning body
    if(!todo) return res.status(404).send(NOT_FOUND);
    res.status(200).send(todo);

  } catch (error) {
    next(error)
  }
};

const deleteTodo = async(req, res, next) => {
  try {
    await todoDAO.destroyTodoById(req.params.todoId);
    res.status(200).send('Todo deleted');

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