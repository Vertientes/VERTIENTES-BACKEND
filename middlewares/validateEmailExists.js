import { ErrorResponse } from "../utils/errorResponse.js";
import User from '../models/userModel.js';

export const validateEmailExists = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new ErrorResponse('E-mail already exists'))
        }
        next()
    } catch (error) {
        next(error)
    }


}





