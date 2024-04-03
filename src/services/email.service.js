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

const sendNotification = async (userEmail, inactividad) => {
    try {
        console.log("user desde emailServices. " + userEmail);
        const from = emailConfig.emailUser;
        const subject = `Eliminación de usuario ${userEmail}`
        const to = userEmail;
        let enlace = 'https://baackend-proyectogarcia-production.up.railway.app';
        let html = '';
        if (inactividad) {
            html = `
            <html>
            <div>
            <h1>Aviso de eliminación de usuario</h1>
            <p>Estimado, ${userEmail} su usuario ha sido eliminado, puede registrarse nuevamente accedidendo al siguiente <a href="${enlace}">enlace</a></p>
            <p>${enlace}</p>
            </div>
            </html>
            `
        } else {
            html = `
            <html>
            <div>
            <h1>Aviso de eliminación de usuario</h1>
            <p>Estimado, ${userEmail} su usuario ha sido eliminado, puede registrarse nuevamente accedidendo al siguiente <a href="${enlace}">enlace</a></p>
            </div>
            </html>
            `
        }
        console.log("from " + from + " to " + to + " subject " + subject);
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
};

const sendProductNotification = async (product) => {
    try {
        console.log("prooduct desde emailServices. " + product);
        const from = emailConfig.emailUser;
        const subject = `Eliminación de producto: ${product.title}`
        const to = product.owner;
        let html = `
            <html>
                <div>
                    <h1>Aviso de eliminación de producto</h1>
                    <p>Estimado, ${product.owner} su producto ${product.title} con código ${product.code} ha sido eliminado.</p>
                    <p></p>
                </div>
            </html>
        `
        console.log("from " + from + " to " + to + " subject " + subject);
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
};

export { sendEmail, sendNotification, sendProductNotification };