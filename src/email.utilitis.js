import nodemailer from "nodemailer"
import configEmail from "./config/email.config.js"

const transport = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    service: configEmail.serviceMail,
    port: configEmail.serviceMailPort,
    auth: {
        user: configEmail.emailUser,
        pass: configEmail.emailPassword,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transport;