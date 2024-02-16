import recoveryDAO from "../dao/recovery.dao.js";
import { v4 as uuidv4 } from "uuid";
import emailConfig from "../config/email.config.js";
import transport from "../email.utilitis.js";


const Recovery = new recoveryDAO();

const createRecovery = async (to, userInfo) => {
    try {
        const from = emailConfig.emailUser;
        const subject = `Recupero de contraseña`;
        const hash = uuidv4();
        let html = `
            <html>
                <div>
                    <h1>Email de recuperación</h1>
                    <p>Accede al siguiente enlace para cambiar su contraseña</p>
                    <a href= "http://localhost:8080/api/recoverPass/change/${hash}">http://localhost:8080/api/recoverPass/change/${hash}</a>
                </div>
            </html>
        `;
        const email = {
            from: from,
            to: to,
            subject: subject,
            html: html,
        };
        const result = await transport.sendMail(email);
        return Recovery.createRecovery(hash, userInfo);
    } catch (err) {

    }
}

const getRecovery = async (hash) => {
    return Recovery.getRecovery (hash);
}

export {createRecovery, getRecovery};