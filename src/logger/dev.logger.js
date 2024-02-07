import winston from "winston";
import { customLevelOptions } from '../utils/loggerCustomlevelOptions.js'

export const logger = winston.createLogger({
    levels: customLevelOptions.level,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple(), 
            ),
        }),
    ]
});