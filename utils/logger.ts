import * as winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

// ─── Custom Log Format ───────────────────────────────────────────────────────
const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `[${ts}] [${level.toUpperCase()}]: ${stack || message}`;
});

// ─── Logger Instance ─────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    }),

    // File transport — all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'automation.log'),
      maxsize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 5,
      tailable: true,
    }),

    // File transport — errors only
    new winston.transports.File({
      filename: path.join(logsDir, 'errors.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

// ─── Helper wrappers ─────────────────────────────────────────────────────────
export const Logger = {
  info: (message: string, meta?: object): void => {
    logger.info(message, meta);
  },

  warn: (message: string, meta?: object): void => {
    logger.warn(message, meta);
  },

  error: (message: string, error?: Error | unknown): void => {
    if (error instanceof Error) {
      logger.error(message, { stack: error.stack });
    } else {
      logger.error(message, { meta: error });
    }
  },

  debug: (message: string, meta?: object): void => {
    logger.debug(message, meta);
  },

  step: (stepName: string): void => {
    logger.info(`▶ STEP: ${stepName}`);
  },

  testStart: (testName: string): void => {
    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`🚀 TEST START: ${testName}`);
    logger.info('='.repeat(60));
  },

  testEnd: (testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void => {
    const icon = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⏭';
    logger.info(`${icon} TEST ${status}: ${testName}`);
    logger.info('='.repeat(60) + '\n');
  },
};

export default logger;
