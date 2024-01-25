import TicketDao from "../dao/ticket.dao.js";
import {v4 as uuidv4} from "uuid"

const Ticket = new TicketDao();

const createTicket = async (amount, email, products) => {
    try {
        const purchase_datetime = new Date().toISOString();
        const code = uuidv4()
        const ticket={
            code:code,
            purchase_datetime:purchase_datetime,
            amount:amount,
            purchaser:email,
            products:products
        }
        console.log("ticket desde Service: " + JSON.stringify(ticket.products));
        return Ticket.createTicket(ticket);
    } catch (err) {

    }
}

export {createTicket};