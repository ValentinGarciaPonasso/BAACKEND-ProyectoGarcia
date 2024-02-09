import { getLogger } from "../logger/factory.js";

export const addLogger = async (req, res, next) => {
    const { logger } = await getLogger();
    const fechaActual = new Date()
    req.logger = logger;
    req.logger.info(
        `${req.method} en ${req.url} - ${fechaActual.toLocaleDateString()} ${fechaActual.toLocaleTimeString()}`
    );
    next();
};