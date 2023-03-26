import { inspect } from 'util';

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: winston.format.json(),
  defaultMeta: { service: process.env.npm_package_name },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.metadata({
          fillExcept: ['level', 'message', 'service', 'module'],
        }),
        winston.format.colorize(),
        winston.format.printf(info => {
          let message = `${info.level}: ${info.message}`;

          if (!process.env.NO_LOG_META && Object.keys(info.metadata).length) {
            const depth = parseInt(process.env.LOG_META_DEPTH ?? '', 10) || 5;
            message = `${message} ${inspect(info.metadata, {
              depth,
              colors: true,
              // compact: 3,
            })}`;
          }

          return message;
        }),
      ),
    }),
  ],
});

export default logger;
