import { Router } from 'express';

const router = Router();

router.get("/", (req, res) => {
    try {
        req.logger.debug("Mensaje de Debug (solo desde Dev)");
        req.logger.http("Mensaje de Http (solo desde Dev)");
        req.logger.info("Mensaje de info");
        req.logger.warning("Mensaje de Warning");
        req.logger.error("Mensaje de Error");
        req.logger.fatal("Mensaje de Fatal");
        res.json({ message: "Mensaje desde loggerTest controller" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
