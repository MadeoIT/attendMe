const router = require('express').Router();
const todoService = require('../Services/todoService');

router.get('/', todoService.getAllTodo);
router.post('/', todoService.saveTodo);
router.get('/:todoId', todoService.getTodo);
router.put('/:todoId', todoService.updateTodo);
router.delete('/:todoId', todoService.deleteTodo);

module.exports = router;