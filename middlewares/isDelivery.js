import { ErrorResponse } from "../utils/errorResponse.js";

// Middleware para verificar si el usuario es un repartidor
export const isDelivery = async (req, res, next) => {
    if (req.user.role !== "delivery") {
        return next(new ErrorResponse('Access denied, you must an delivery role', 401))
    }
    next();
}