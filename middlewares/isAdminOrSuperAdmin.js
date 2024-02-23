import { ErrorResponse } from "../utils/errorResponse.js";

// Middleware para verificar si el usuario logueado es super administrador
export const isAdminOrSuperAdmin = async (req, res, next) => {
    if (req.user.role !== "super_admin" && req.user.role !== 'admin') {
        return next(new ErrorResponse('Access denied, you must an super admin or admin', 401))
    }
    next();
}