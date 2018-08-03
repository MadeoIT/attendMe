const router = require('express').Router();
const todoService = require('../Services/todoService');
const { isValid } = require('../middleware/auth');

router.get('/', isValid('jwt'), todoService.getAllTodo);
router.post('/', isValid('jwt'), todoService.saveTodo);
router.get('/:todoId', isValid('jwt'), todoService.getTodo);
router.put('/:todoId', isValid('jwt'), todoService.updateTodo);
router.delete('/:todoId', isValid('jwt'), todoService.deleteTodo);

module.exports = router;