import Tickets from "./models/ticket.model.js";

class ticketDAO{
    constructor(){}

    async createTicket(ticket){
        try{
            return await Tickets.create(ticket);
        }catch (e) {
            console.log("Error creating ticket" + e);
            throw e;
        }
    }

    async getTicket(code){
        try {
            const ticket = await Tickets.find({ code: code })
            return ticket
        } catch (e) {
            console.log("Error creating ticket" + e);
            throw e;
        }
    }
}
export default ticketDAO;