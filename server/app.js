const app = require('express')();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { infoLogger, errorLogger } = require('./middleware/logger');

infoLogger(app.get('env'));

app.use(cookieParser());
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./startup/routes')(app);

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
