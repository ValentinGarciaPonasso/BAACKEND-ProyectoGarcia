import recoveryModel from "./models/recovery.model.js";
import recoveryDTO from "../DTOs/recovery.dto.js";

class recoveryDAO{
    constructor(){}

    async createRecovery(hash, userInfo){
        try{
            const newRecovery = new recoveryDTO(hash, userInfo);
            return await recoveryModel.create(newRecovery);
        }catch (e) {
            console.log("Error creating ticket" + e);
            throw e;
        }
    }

    async getRecovery(hash){
        try {
            console.log("hash obtenido desde dao: " + hash);
            const recovery = await recoveryModel.findOne({ hash: hash })
            console.log("Recovery found: " + recovery);
            return recovery
        } catch (e) {
            console.log("Error creating ticket" + e);
            throw e;
        }
    }
}
export default recoveryDAO;