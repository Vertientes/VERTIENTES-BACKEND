import { ErrorResponse } from "../utils/errorResponse.js";

//funcion para autenticar usuario
export const isSuperAdmin = async (req, res, next) => {
    if (req.user.role !== "super_admin") {
        return next(new ErrorResponse('Access denied, you must an super admin', 401))
    }
    next();
}