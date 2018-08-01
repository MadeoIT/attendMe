const { errorLogger } = require('./logger');

const errorHandler = (err, req, res, next) => {

  if (!err) {
    return next();
  };
  
  errorLogger(err);

  if(err.status === 500){
    return res.status(500).send('Something went wrong');
  }

  res.status(err.status || 500).send(err.message);
};

module.exports = {
  errorHandler
}