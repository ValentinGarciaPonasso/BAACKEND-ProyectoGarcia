import emailConfig from "../config/email.config.js";
import transport from "../email.utilitis.js";

const sendEmail = async (ticket) => {
    try {
        console.log("ticket desde emailServices. " + ticket);
        const from = emailConfig.emailUser;
        const to = ticket.purchaser;
        const subject = `Recibo compra ${ticket.code}`
        console.log("from " + from + " to " + to + " subject " + subject);
        let html = `
        <html>
            <div>
                <h1>Ticket</h1>
                <h2>Compra Finalizada</h2>
                <p>Orden: ${ticket.code}</p>
                <p>Comprador: ${ticket.purchaser}</p>
                <p>Hora de compra: ${ticket.purchase_datetime}</p>
            <div class="bloque">
        `
        ticket.products.forEach(product => {
            if (product.inStok) {
                html += `--------------------------
                    <div class="tarjeta">
                        <p>Producto: ${product.title}</p>
                        <p>Precio: ${product.price}</p>
                        <p>Cantidad: ${product.quantity}</p>
                    </div>
                `
            } else {
                html += `--------------------------
                    <div class="tarjeta">
                        <p>Producto: ${product.title}</p>
                        <p>Producto sin stock, no se agregó a su compra</p>
                    </div>
                `
            }
        });
        html += `
                        <h2>Total de la compra: ${ticket.amount}</h2>
                    </div>
                </div>
            </html>
        `
        console.log(html);
        const email = {
            from: from,
            to: to,
            subject: subject,
            html: html,
        };
        const result = await transport.sendMail(email);
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export { sendEmail };