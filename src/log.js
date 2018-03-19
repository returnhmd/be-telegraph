const winston = require('winston')
const { env } = require('./config')

const { colorize, timestamp, align, printf } = winston.format

const logger = winston.createLogger({
  format: winston.format.combine(
    colorize(),
    timestamp(),
    align(),
    printf(info => `${info.timestamp} [ ${info.level} ]: ${info.message}`),
  ),
  // need to fix it
  transports: [new winston.transports.Console({ silent: env.isTest })],
})

module.exports = logger
