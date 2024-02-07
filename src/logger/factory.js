import {appConfig}  from "../config/app.config.js";

export async function getLogger() {
    let response 
    switch (appConfig.enviroment) {
        case "development":
            console.log("Eviroment: Dev");
            response = await import ("./dev.logger.js");
            break;
        case "production":
            console.log("Eviroment: Prod");
            response = await import ("./prod.logger.js");
            break;
        default:
            break;
    }

    return response;
};