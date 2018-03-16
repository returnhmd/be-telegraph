const winston = require('winston')

// const config = require('./config')

const { colorize, timestamp, align, printf } = winston.format

const logger = winston.createLogger({
  format: winston.format.combine(
    colorize(),
    timestamp(),
    align(),
    printf(info => `${info.timestamp} [ ${info.level} ]: ${info.message}`),
  ),
  transports: new winston.transports.Console(),
})

module.exports = logger
