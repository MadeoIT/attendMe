const winston = require('winston');
const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info) => {
    const {
      timestamp,
      level,
      message,
      ...args
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
)

const logger = winston.createLogger({
  format: winston.format.json(),
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logfile.log',
    format: alignedWithColorsAndTime
  }));

  //TODO: add db logging

};

if (process.env.NODE_ENV === 'test') {
  logger.add(new winston.transports.Console({
    format: alignedWithColorsAndTime
  }));
};

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  logger.add(new winston.transports.Console({
    format: alignedWithColorsAndTime
  }));
};

const errorLogger = (err) => {
  logger.log({
    level: 'error',
    message: err.message + " " + new Date()
  });
}

const infoLogger = (log) => {
  logger.log({
    level: 'info',
    message: log
  })
}

module.exports = {
  logger,
  infoLogger,
  errorLogger
};