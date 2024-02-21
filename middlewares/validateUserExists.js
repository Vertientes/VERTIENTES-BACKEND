import { ErrorResponse } from "../utils/errorResponse.js";
import User from '../modules/user/userModel.js';

// Middleware para validar si un usuario ya ha sido creado
export const validateUserExists = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ dni: req.body.dni });
        if (existingUser) {
            return next(new ErrorResponse('User already exixts', 409))
        }
        next()
    } catch (error) {
        next(error)
    }
}



