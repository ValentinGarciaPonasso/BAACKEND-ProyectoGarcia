import EnumError from "../../utils/enum.error.js";

export default (error, req, res, next) => {
    console.log(error.cause);

    switch (error.code) {
        case EnumError.INVALID_TYPES_ERROR:
            res.json({error: error.name});
            break;
        
            default:
                res.json({error: "Unable error"});
    }
}