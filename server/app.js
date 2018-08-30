const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const { infoLogger, errorLogger } = require('./middleware/logger');

infoLogger(app.get('env'));

app.use(cookieParser());
app.use(cors({ 
  origin: 'http://localhost:3000', credentials: true 
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./startup/routes')(app);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(compression());
  app.use(express.static('../client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  });
};

//Error handling
process.on('uncaughtException', (err) => {
  errorLogger(err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  errorLogger(err);
  process.exit(1);
});
app.use(errorHandler);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  infoLogger(`Server started port: ${port}`);
});

module.exports = server;
