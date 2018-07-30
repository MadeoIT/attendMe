const router = require('express').Router();
const todoService = require('../Services/todoService');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, todoService.getAllTodo);
router.post('/', isAuthenticated, todoService.saveTodo);
router.get('/:todoId', isAuthenticated, todoService.getTodo);
router.put('/:todoId', isAuthenticated, todoService.updateTodo);
router.delete('/:todoId', isAuthenticated, todoService.deleteTodo);

module.exports = router;