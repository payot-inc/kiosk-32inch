import { ipcMain } from 'electron';
import winston from 'winston';
import 'winston-daily-rotate-file';

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles: '30d',
  }),
});

ipcMain.handle('logger', () => logger);
