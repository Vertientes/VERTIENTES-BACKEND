import { ErrorResponse } from "../utils/errorResponse.js";
import User from '../modules/user/userModel.js';

export const validateUserExists = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ dni: req.body.dni });
        if (existingUser) {
            return next(new ErrorResponse('User already exists'))
        }
        next()
    } catch (error) {
        next(error)
    }


}



