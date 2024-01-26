import { Router } from "express";
import * as ticketService from "../services/ticket.service.js";
import * as emailService from "../services/email.service.js";

const router = Router();

router.post("/:tid", async (req, res) => {
    try {
        const code = req.params.tid;
        console.log("hola desde controller " + code);
        const tickets = await ticketService.getTicket(code);
        const ticket = tickets[0];
        console.log("Ticket desde ameil controller: " + ticket )
        const email = emailService.sendEmail(ticket);
        const cart = 
        res.status(200).redirect("/api/cart/:cid/purchase");
    } catch (err) {
        res.status(500).send('Error al enviar email');
    }
})

export default router