import {Router} from "express";
import "dotenv/config.js";

const router = new Router();

router.get('/config', (req, res) => {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    res.json({ backendUrl });
})

export default router;