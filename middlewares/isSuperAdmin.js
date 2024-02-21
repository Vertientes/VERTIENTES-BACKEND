import { ErrorResponse } from "../utils/errorResponse.js";

// Middleware para verificar si el usuario logueado es super administrador
export const isSuperAdmin = async (req, res, next) => {
    if (req.user.role !== "super_admin") {
        return next(new ErrorResponse('Access denied, you must an super admin', 401))
    }
    next();
}