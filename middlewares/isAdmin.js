import { ErrorResponse } from "../utils/errorResponse.js";

//funcion para autenticar usuario
export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorResponse('Access denied, you must an admin', 401))
    }
    next();
}