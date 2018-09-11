const router = require('express').Router();
//aconst todoService = require('../Services/todoService');
const { isValid } = require('../middleware/auth');
const { geolocationService } = require('../Services/geoLocationService');

//router.get('/', isValid('jwt'), geolocationService, todoService.getAllTodo);
//router.post('/', isValid('jwt'), geolocationService, todoService.saveTodo);
//router.get('/:todoId', isValid('jwt'), geolocationService, todoService.getTodo);
//router.put('/:todoId', isValid('jwt'), geolocationService, todoService.updateTodo);
//router.put('/', isValid('jwt'), geolocationService, todoService.updateTodoBatch);
//router.delete('/:todoId', isValid('jwt'), geolocationService, todoService.deleteTodo);

module.exports = router;